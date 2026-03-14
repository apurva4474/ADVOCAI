import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

const isMobile = width < 768;

export default function HowItWorks() {

const lineAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(lineAnim,{
    toValue:1,
    duration:1200,
    useNativeDriver:false
  }).start();
},[]);

const animatedWidth = lineAnim.interpolate({
  inputRange:[0,1],
  outputRange:["0%","80%"]
});

return(

<View style={styles.container}>

<Text style={styles.heading}>How ADVOC-AI Works</Text>

<View style={styles.stepsWrapper}>

{/* connector line only for desktop */}
{!isMobile && (
<Animated.View style={[styles.line,{width:animatedWidth}]} />
)}

<View style={[styles.steps,isMobile && styles.mobileSteps]}>

<View style={styles.step}>
<View style={styles.circle}>
<Text style={styles.number}>1</Text>
</View>

<Text style={styles.title}>Upload Case File</Text>

<Text style={styles.text}>
Upload PDFs or images containing legal case information.
</Text>
</View>


<View style={styles.step}>
<View style={styles.circle}>
<Text style={styles.number}>2</Text>
</View>

<Text style={styles.title}>AI Analysis</Text>

<Text style={styles.text}>
ADVOC-AI analyses the document and extracts key insights.
</Text>
</View>


<View style={styles.step}>
<View style={styles.circle}>
<Text style={styles.number}>3</Text>
</View>

<Text style={styles.title}>Get Results</Text>

<Text style={styles.text}>
Receive summaries, arguments and timelines instantly.
</Text>
</View>

</View>
</View>
</View>

);
}

const styles = StyleSheet.create({

container:{
width:"100%",
paddingVertical:90,
paddingHorizontal:20,
backgroundColor:"#f5f7ff",
alignItems:"center"
},

heading:{
fontSize:34,
fontWeight:"bold",
color:"#111",
marginBottom:70,
textAlign:"center"
},

stepsWrapper:{
width:"100%",
maxWidth:1000,
alignItems:"center",
position:"relative"
},

line:{
position:"absolute",
top:35,
height:3,
backgroundColor:"#4C6EF5"
},

steps:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"flex-start",
width:"100%"
},

mobileSteps:{
flexDirection:"column",
alignItems:"center"
},

step:{
width:isMobile?"100%":260,
alignItems:"center",
marginBottom:50,
paddingHorizontal:10
},

circle:{
width:70,
height:70,
borderRadius:35,
backgroundColor:"#4C6EF5",
justifyContent:"center",
alignItems:"center",
marginBottom:20
},

number:{
color:"white",
fontSize:26,
fontWeight:"bold"
},

title:{
fontSize:20,
fontWeight:"bold",
color:"#111",
marginBottom:10,
textAlign:"center"
},

text:{
fontSize:15,
color:"#555",
textAlign:"center",
lineHeight:22
}

});