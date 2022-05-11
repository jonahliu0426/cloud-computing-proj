package com.cc.pipelineapi.service;

import com.alibaba.fastjson.JSONObject;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;

import java.util.Collections;
import java.util.List;
import java.util.Properties;

@Service
public class JobService {

    private static final String bootstrapServers = "b-1.kafka-cluster.o36u01.c24.kafka.us-east-1.amazonaws.com:9092,b-2.kafka-cluster.o36u01.c24.kafka.us-east-1.amazonaws.com:9092";
    private static final String topic = "tag-topic";
    private static final String redisHost = "localhost";
    private static final int redisPort = 6379;
    private static final String redisKey = "top-tags";

    public void addTag(String tagName) {
        Properties properties = new Properties();
        properties.put("bootstrap.servers", bootstrapServers);
        properties.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        properties.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer") ;
        KafkaProducer producer = new KafkaProducer<String, String>(properties);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("tag", tagName);
        jsonObject.put("timestamp", System.currentTimeMillis());
        producer.send(new ProducerRecord<>(topic, "tag", jsonObject.toString()));
    }

    public List<String> getTopTags() {
        Jedis jedis = new Jedis(redisHost, redisPort);
        List<String> tags = jedis.lrange(redisKey, 0, -1);
        Collections.reverse(tags);
        return tags;
    }

}
