package com.tanzhi.mapper;


import com.tanzhi.pojo.Markerdata;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MarkerdataMapper {

    @Select("Select * from markerdata ORDER BY date ASC")
    public List<Markerdata> selectMarkerAll();

    @Delete("delete from markerdata where id=#{id}")
    public int deleteMarker(@Param("id") String id);

    @Insert("INSERT INTO markerdata(id,title,text,latitude,longitude,image,date) VALUES(#{markerdata.id},#{markerdata.title},#{markerdata.text},#{markerdata.latitude},#{markerdata.longitude},#{markerdata.image},#{markerdata.date})")
    public int insertMarkerdata(@Param("markerdata")Markerdata markerdata);

    @Update("UPDATE markerdata SET title=#{markerdata.title},text=#{markerdata.text},latitude=#{markerdata.latitude},longitude=#{markerdata.longitude},image=#{markerdata.image},date=#{markerdata.date} where id=#{markerdata.id}")
    public int updateMarkerdata(@Param("markerdata")Markerdata markerdata);



}
