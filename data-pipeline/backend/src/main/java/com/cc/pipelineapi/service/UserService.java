package com.cc.pipelineapi.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cc.pipelineapi.mapper.UserMapper;
import com.cc.pipelineapi.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserService extends ServiceImpl<UserMapper, User> {

    public void topUp(String username, Integer amount) {
        User user = baseMapper.selectById(username);
        if (user == null) {
            user = new User();
            user.setUsername(username);
            user.setBalance(0);
        }
        user.setBalance(user.getBalance() + amount);
        saveOrUpdate(user);
    }

    public Integer getBalance(String username) {
        User user = baseMapper.selectById(username);
        return user == null ? 0 : user.getBalance();
    }

}
