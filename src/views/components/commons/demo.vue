<template>
     <div >
       <div id="zm_mhz"> 迷幻紫</div>
<div id="zm_xgh"> 西瓜红</div>
<div id="zm_tkzj">天空之境</div>
<div id="zm_xyz">小宇宙</div>
<div id="zm_gll">撖榄绿</div>
<div id="zm_xty">小太阳</div>
<div id="zm_yyz">优雅紫</div>
<div id="zm_szh">深邃黑</div>
<div id="zm_wbk">无边框</div>
    </div>
</template>


<script>
module.exports = {
  props: {
  },
  mounted() {
  },
  methods: {
  }

}
</script>
<style scoped>
#zm_mhz,#zm_xgh,#zm_tkzj,#zm_xyz,#zm_gll ,#zm_xty,#zm_yyz,#zm_szh,#zm_wbk{
    /*圆角值,在此定义*/
    border-radius: 8px;
}
/*迷幻紫*/
#zm_mhz{
    color: #555555;
    overflow: hidden;
    margin: 10px 0;
    padding: 15px 15px 15px 35px;
    /*border-radius: 10px;*/
    box-shadow: 6px 0 12px -5px rgb(190, 196, 252), -6px 0 12px -5px rgb(189, 196, 252);
    background-color: #8EC5FC;
    background-image: linear-gradient(62deg,#8EC5FC 0%,#E0C3FC 100%);
    background-image: -webkit-linear-gradient(62deg,#8EC5FC 0%,#E0C3FC 100%);
}
/*西瓜红*/
#zm_xgh{
        color: #555555;
    overflow: hidden;
    margin: 10px 0;
    padding: 15px 15px 15px 35px;
    /*border-radius: 10px;*/
    box-shadow: 6px 0 12px -5px rgb(255, 176, 172), -6px 0 12px -5px rgb(255, 161, 174);
    background-color: #ff9a8b66;
    background-image: linear-gradient(220deg,#FF9A8B 0%,#ff6a8838 55%,#FF99AC 100%);
    background-image: -webkit-linear-gradient(220deg,#ff9a8b7a 0%,#ff6a88ab 55%,#ff99ac82 100%);
}
/*华为P30 天空之境*/
#zm_tkzj {
    color: #555555;
    overflow: hidden;
    margin: 10px 0;
    padding: 15px 15px 15px 35px;
    /*border-radius: 10px;*/
    box-shadow: 6px 0 12px -5px rgb(253, 223, 234), -6px 0 12px -5px rgb(215, 240, 243);
    background-color: #FFDEE9;
    background-image: linear-gradient(0deg,#ffdee9c4 0%,#b5fffc8f 100%);
    background-image: -webkit-linear-gradient(0deg,#ffdee9c4 0%,#b5fffc8f 100%);
}
/*小宇宙*/
#zm_xyz {
    color: #eeeeee;
    overflow: hidden;
    margin: 10px 0;
    padding: 15px 15px 15px 35px;
    /*border-radius: 10px;*/
    box-shadow: 6px 0 12px -5px rgb(12, 85, 141), -6px 0 12px -5px rgba(10, 58, 93, 0);
    background-image: radial-gradient( circle 263px at 100.2% 3%, rgba(12,85,141,1) 31.1%, rgba(205,181,93,1) 36.4%, rgba(244,102,90,1) 50.9%, rgba(199,206,187,1) 60.7%, rgba(249,140,69,1) 72.5%, rgba(12,73,116,1) 72.6% );
}
/*橄榄绿*/
#zm_gll {
    color: #eeeeee;
    overflow: hidden;
    margin: 10px 0;
    padding: 15px 15px 15px 35px;
    /*border-radius: 10px;*/
    box-shadow: 6px 0 12px -5px rgb(68, 110, 92), -6px 0 12px -5px rgb(204, 212, 163);
    background-image: linear-gradient( 102deg, rgba(68,110,92,1) 17.4%, rgba(107,156,120,1) 49.3%, rgba(154,183,130,1) 83.4%, rgba(247,237,191,1) 110.3% );
}
/*小太阳*/
#zm_xty {
    color: #ffffff;
    overflow: hidden;
    margin: 10px 0;
    padding: 15px 15px 15px 35px;
     /*border-radius: 10px; */
    box-shadow: 6px 0 12px -5px rgb(253, 223, 234), -6px 0 12px -5px rgb(215, 240, 243);
    background-image: radial-gradient( circle farthest-corner at -8.9% 51.2%, rgba(255,124,0,1) 0%, rgba(255,124,0,1) 15.9%, rgba(255,163,77,1) 15.9%, rgba(255,163,77,1) 24.4%, rgba(19,30,37,1) 24.5%, rgba(19,30,37,1) 66% );
}
/*优雅紫*/
#zm_yyz {
    color: #ffffff;
    overflow: hidden;
    margin: 10px 0;
    padding: 15px 15px 15px 35px;
    /*border-radius: 10px;*/
    box-shadow: 6px 0 12px -5px rgb(175, 160, 208), -6px 0 12px -5px rgba(177, 161, 207, 0);
    background-image: radial-gradient( circle farthest-corner at 10% 20%, rgba(95,117,227,1) 0%, rgba(188,167,205,1) 90% );
}
/*深邃黑*/
#zm_szh {
    color: #c7c7c7;
    overflow: hidden;
    margin: 10px 0;
    padding: 15px 15px 15px 35px;
    /*border-radius: 5px;*/
    box-shadow: 6px 0 12px -5px rgb(155, 170, 185), -6px 0 12px -5px rgba(177, 161, 207, 0);
    background-image: radial-gradient( circle farthest-corner at 10% 20%, rgba(0,0,0,1) 0%, rgba(64,64,64,1) 90.2% );
}
/*无边框*/
#zm_wbk {
    color: #000000;
    overflow: hidden;
    margin: 10px 0;
    padding: 15px 15px 15px 35px;
}
#zm_xyz a , #zm_gll a{
     color: #eeeeee;
}
#zm_szh a{
    color: #c7c7c7;    
}
#zm_xty a, #zm_yyz a{
    color: #ffffff;
}
</style>
