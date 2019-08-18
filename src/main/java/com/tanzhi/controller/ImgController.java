package com.tanzhi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ImgController {
    private final ResourceLoader resourceLoader;


    @Autowired
    public ImgController(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    /**
     * 显示单张图片
     * @return
     */
    @RequestMapping("/show")
    public ResponseEntity showPhotos(String image){
        String filePath = "D:\\tjvi\\dituDemo1\\src\\main\\resources\\static\\img\\";
        try {
            // 由于是读取本机的文件，file是一定要加上的， path是在application配置文件中的路径
            return ResponseEntity.ok(resourceLoader.getResource("file:" + filePath + image));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }




}
