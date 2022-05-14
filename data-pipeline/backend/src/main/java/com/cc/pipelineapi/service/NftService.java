package com.cc.pipelineapi.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cc.pipelineapi.mapper.NftMapper;
import com.cc.pipelineapi.model.Nft;
import com.cc.pipelineapi.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NftService extends ServiceImpl<NftMapper, Nft> {

    @Autowired
    UserService userService;

    public void newNft(String nftId, String owner) {
        Nft nft = new Nft();
        nft.setId(nftId);
        nft.setOwner(owner);
        nft.setPrice(0);
        saveOrUpdate(nft);
    }

    public boolean buyNft(String nftId, String username) {
        User buyer = userService.getById(username);
        Nft nft = getById(nftId);
        if (buyer.getBalance() < nft.getPrice()) {
            return false;
        }
        buyer.setBalance(buyer.getBalance() - nft.getPrice());
        userService.saveOrUpdate(buyer);
        String seller = nft.getOwner();
        userService.topUp(seller, nft.getPrice());
        nft.setOwner(username);
        saveOrUpdate(nft);
        return true;
    }

    public void setPrice(String nftId, Integer price) {
        Nft nft = getById(nftId);
        nft.setPrice(price);
        saveOrUpdate(nft);
    }

    public String[] getNft(String nftId) {
        Nft nft = getById(nftId);
        String[] info = {nft.getOwner(), String.valueOf(nft.getPrice())};
        return info;
    }

    public String[] getNft(String nftId, String username) {
        Nft nft = getById(nftId);
        if (nft == null) {
            newNft(nftId, username);
        }
        return getNft(nftId);
    }

}
