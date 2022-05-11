package com.cc.pipelineapi.controller;

import com.cc.pipelineapi.common.Result;
import com.cc.pipelineapi.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/etl")
public class JobController {

    @Autowired
    JobService jobService;

    @GetMapping("tag/{tagName}")
    public Result addTag(@PathVariable("tagName") String tagName) {
        jobService.addTag(tagName);
        return Result.success(null);
    }

    @GetMapping("top-tags")
    public Result getTopTags() {
        return Result.success(jobService.getTopTags());
    }

}
