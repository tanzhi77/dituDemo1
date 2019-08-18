package com.tanzhi.service;


import com.tanzhi.mapper.MarkerdataMapper;
import com.tanzhi.pojo.Markerdata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarkerdataService {

    @Autowired
    private MarkerdataMapper markerdataMapper;


    public List<Markerdata> selectMarkerAll(){
        return markerdataMapper.selectMarkerAll();
    }

    public boolean deleteMarker(String id){
        if (markerdataMapper.deleteMarker(id)>0){
            return true;
        }
        return false;
    }

    public boolean insertMarkerdata(Markerdata markerdata){
        if (markerdataMapper.insertMarkerdata(markerdata)>0){
            return true;
        }
        return false;
    }

    public boolean updateMarkerdata(Markerdata markerdata){
        if (markerdataMapper.updateMarkerdata(markerdata)>0){
            return true;
        }
        return false;
    }


}
