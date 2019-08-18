package com.tanzhi.controller;


import com.tanzhi.pojo.Markerdata;
import com.tanzhi.service.MarkerdataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
public class MarkerdataServiceController {
    @Autowired
    private MarkerdataService markerdataService;

    //指定本地文件夹存储图片
    String filePath = "D:/tjvi/dituDemo1/src/main/resources/static/img/";

    @PostMapping("/getMarkerAll")
    public List<Markerdata> GetMarkerAll(){
        return markerdataService.selectMarkerAll();
    }

    @PostMapping("/delMarker")
    public Object DelMarkerd(@RequestBody Markerdata markerdata){

        if (markerdata.getImage()!="" && markerdata.getImage()!=null){
            File file = new File(filePath + markerdata.getImage());
            file.delete();
        }
        markerdataService.deleteMarker(markerdata.getId());
        return GetMarkerAll();
    }

    @PostMapping("/InsertMarkerdata")
    public Object InsertMarkerdata(String title, String text, String latitude, String longitude, String date, MultipartFile file){
        SimpleDateFormat sf= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date d;
        String id = UUID.randomUUID().toString().replace("-", "");
        String fileName = "";

        if (file.getSize() > 0){
            //获取文件名
            fileName = file.getOriginalFilename();
            //获取文件
            String suffixName = fileName.substring(fileName.lastIndexOf("."));
            //重新生成文件名
            fileName = UUID.randomUUID()+suffixName;
        }
        try {
            //将图片保存到static文件夹里
            if (file.getSize() > 0)
                file.transferTo(new File(filePath+fileName));
            d = sf.parse(date);
            Markerdata markerdata = new Markerdata();
            markerdata.setId(id);
            markerdata.setLatitude(latitude);
            markerdata.setLongitude(longitude);
            markerdata.setTitle(title);
            markerdata.setText(text);
            markerdata.setImage(fileName);
            markerdata.setDate(d);
            markerdataService.insertMarkerdata(markerdata);
            return GetMarkerAll();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @PostMapping("/UpdateMarkerdata")
    public Object UpdateMarkerdata(String title,String id, String text, String latitude, String longitude, String date,String image, MultipartFile file){
        SimpleDateFormat sf= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date d;
        String fileName = image;
        if (file.getSize() > 0){
            //获取文件名
            fileName = file.getOriginalFilename();
            //获取文件
            String suffixName = fileName.substring(fileName.lastIndexOf("."));
            //重新生成文件名
            fileName = UUID.randomUUID()+suffixName;
            File deletefile = new File(filePath + image);
            deletefile.delete();
        }
        try {
            //将图片保存到static/img文件夹里
            if (file.getSize() > 0)
                file.transferTo(new File(filePath+fileName));
            d = sf.parse(date);
            Markerdata markerdata = new Markerdata();
            markerdata.setId(id);
            markerdata.setLatitude(latitude);
            markerdata.setLongitude(longitude);
            markerdata.setTitle(title);
            markerdata.setText(text);
            markerdata.setImage(fileName);
            markerdata.setDate(d);
            markerdataService.updateMarkerdata(markerdata);
            return GetMarkerAll();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }





}
