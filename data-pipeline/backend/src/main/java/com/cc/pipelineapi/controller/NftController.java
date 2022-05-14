package com.cc.pipelineapi.controller;

import com.cc.pipelineapi.common.Result;
import com.cc.pipelineapi.service.NftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("nft")
public class NftController {

    @Autowired
    NftService nftService;

    @GetMapping("new/{id}/{owner}")
    public Result newNft(@PathVariable("id") String nftId, @PathVariable("owner") String owner) {
        nftService.newNft(nftId, owner);
        return Result.success(null);
    }

    @GetMapping("buy/{id}/{userId}")
    public Result buyNft(@PathVariable("id") String nftId, @PathVariable("userId") String userId) {
        return nftService.buyNft(nftId, userId) ? Result.success(null) : Result.fail("Insufficient balance");
    }

    @GetMapping("set-price/{id}/{price}")
    public Result setPrice(@PathVariable("id") String nftId, @PathVariable("price") Integer price) {
        nftService.setPrice(nftId, price);
        return Result.success(null);
    }

    @GetMapping("{id}")
    public Result getNft(@PathVariable("id") String nftId) {
        return Result.success(nftService.getNft(nftId));
    }

    @GetMapping("{id}/{username}")
    public Result getNft(@PathVariable("id") String nftId, @PathVariable String username) {
        return Result.success(nftService.getNft(nftId, username));
    }

}
