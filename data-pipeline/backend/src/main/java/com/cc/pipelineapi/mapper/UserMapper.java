package com.cc.pipelineapi.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cc.pipelineapi.model.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {

}
