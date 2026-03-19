import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

export default function Navbar() {

 const router = useRouter();
  return (
    <View style={styles.navbar}>

      {/* LEFT */}
      <Text style={styles.logo}>ADVOC-AI</Text>

      {/* CENTER */}
      <TouchableOpacity onPress={()=>router.push("/dashboard")}style={{flexDirection:"row", justifyContent:"space-between"}}>
       <Text>Home</Text>
     </TouchableOpacity>

     <TouchableOpacity onPress={()=>router.push("/summarizer")}style={{flexDirection:"row", justifyContent:"space-between"}}>
       <Text>Summarizer</Text>
     </TouchableOpacity>

     <TouchableOpacity onPress={()=>router.push("/argument")}style={{flexDirection:"row", justifyContent:"space-between"}}>
       <Text>Argument</Text>
     </TouchableOpacity>

      {/* RIGHT */}
      <View style={styles.auth}>
        <TouchableOpacity style={styles.outline}>
          <Text style={styles.outlineText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.login}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  navbar: {
    position: "absolute",
    top: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    zIndex: 10,
  },

  logo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },

  menu: {
    flexDirection: "row",
    gap: 25,
  },

  link: {
    color: "white",
    fontSize: 15,
  },

  auth: {
    flexDirection: "row",
    gap: 10,
  },

  outline: {
    borderWidth: 1,
    borderColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  outlineText: {
    color: "white",
  },

  login: {
    backgroundColor: "#4C6EF5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  loginText: {
    color: "white",
  },

});