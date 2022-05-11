import com.alibaba.fastjson.JSONObject;
import org.apache.flink.api.common.functions.FlatMapFunction;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.TimeCharacteristic;
import org.apache.flink.streaming.api.datastream.SingleOutputStreamOperator;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.sink.RichSinkFunction;
import org.apache.flink.streaming.api.functions.timestamps.BoundedOutOfOrdernessTimestampExtractor;
import org.apache.flink.streaming.api.functions.windowing.AllWindowFunction;
import org.apache.flink.streaming.api.windowing.time.Time;
import org.apache.flink.streaming.api.windowing.windows.TimeWindow;
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaConsumer;
import org.apache.flink.util.Collector;
import redis.clients.jedis.Jedis;

import java.util.*;

import static org.apache.hadoop.util.GenericsUtil.toArray;

public class TopTagStream {
    private static final String bootstrapServers = "b-1.kafka-cluster.o36u01.c24.kafka.us-east-1.amazonaws.com:9092,b-2.kafka-cluster.o36u01.c24.kafka.us-east-1.amazonaws.com:9092";
    private static final String topic = "tag-topic";
    private static final int allowLatency = 0;
    private static final int maxItems = 10;
    private static final String redisHost = "localhost";
    private static final int redisPort = 6379;
    private static final String redisKey = "top-tags";

    public static void main(String[] args) throws Exception {
        Properties properties = new Properties();
        properties.setProperty("bootstrap.servers", bootstrapServers);
        properties.setProperty("auto.offset.reset", "earliest");
        FlinkKafkaConsumer flinkKafkaConsumer = new FlinkKafkaConsumer(topic, new SimpleStringSchema(), properties);
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime);
        env.setParallelism(1);
        SingleOutputStreamOperator<JSONObject> stream = env.addSource(flinkKafkaConsumer)
                .flatMap(new JsonFlatMap())
                .assignTimestampsAndWatermarks(new WatermarkTimestampExtractor(Time.seconds(allowLatency)));
        stream
                .timeWindowAll(Time.hours(1), Time.seconds(10))
                .apply(new TopProcess())
                .addSink(new ListSink());
        env.execute("FlinkJob");
    }

    public static class JsonFlatMap implements FlatMapFunction<String, JSONObject> {
        @Override
        public void flatMap(String s, Collector<JSONObject> collector) {
            collector.collect(JSONObject.parseObject(s));
        }
    }

    public static class WatermarkTimestampExtractor extends BoundedOutOfOrdernessTimestampExtractor<JSONObject> {
        private static final String key = "timestamp";

        public WatermarkTimestampExtractor(Time maxOutOfOrderness) {
            super(maxOutOfOrderness);
        }

        @Override
        public long extractTimestamp(JSONObject jsonObject) {
            return jsonObject.containsKey(key) ? jsonObject.getLong(key) : System.currentTimeMillis();
        }
    }

    public static class TopProcess implements AllWindowFunction<JSONObject, String[], TimeWindow> {
        @Override
        public void apply(TimeWindow timeWindow, Iterable<JSONObject> iterable, Collector<String[]> collector) {
            HashMap<String, Integer> count = new HashMap<>(16);
            for (JSONObject value : iterable) {
                String tag = value.getString("tag");
                count.put(tag, count.getOrDefault(tag, 0) + 1);
            }
            PriorityQueue<String> queue = new PriorityQueue<>(Comparator.comparingInt(count::get));
            for (String tag : count.keySet()) {
                queue.add(tag);
                if (queue.size() > maxItems) {
                    queue.poll();
                }
            }
            ArrayList<String> list = new ArrayList<>();
            while (!queue.isEmpty()) {
                String tag = queue.poll();
                list.add(tag + "," + count.get(tag));
            }
            collector.collect(toArray(list));
        }
    }

    public static class ListSink extends RichSinkFunction<String[]> {
        private transient Jedis jedis;

        @Override
        public void open(Configuration parameters) {
            jedis = new Jedis(redisHost, redisPort, 5000);
        }

        @Override
        public void invoke(String[] value, Context context) {
            if (!jedis.isConnected()) {
                jedis.connect();
            }
            jedis.del(redisKey);
            jedis.rpush(redisKey, value);
        }

        @Override
        public void close() {
            jedis.close();
        }
    }
}
