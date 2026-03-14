import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const isMobile = width < 768;

export default function Hero() {
  const pulse = useRef(new Animated.Value(1)).current;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/hero.avif")}
      style={styles.hero}
      resizeMode="cover"
    >
      <BlurView intensity={40} style={styles.overlay}>
        <View style={[styles.content, isMobile && styles.mobileContent]}>
          
          {/* TEXT SECTION */}
          <View style={styles.textContainer}>
            <Text style={[styles.title, isMobile && styles.titleMobile]}>
              AI Powered{"\n"}Legal Assistant
            </Text>

            <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
              Simplify legal research, generate arguments,
              and analyse case files instantly with ADVOC-AI.
            </Text>
          </View>

          {/* PLAY BUTTON */}
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Animated.View
              style={[
                styles.play,
                { transform: [{ scale: pulse }] }
              ]}
            >
              <Text style={styles.playText}>▶</Text>
            </Animated.View>
          </TouchableOpacity>

        </View>
      </BlurView>

      {/* VIDEO MODAL */}
      <Modal visible={open} transparent animationType="fade">
        <View style={styles.modal}>

          <TouchableOpacity
            style={styles.close}
            onPress={() => setOpen(false)}
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <Video
            source={require("../assets/images/video.mp4")}
            style={styles.video}
            useNativeControls
            shouldPlay
            isLooping
            resizeMode={ResizeMode.CONTAIN}
          />

        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  hero: {
    height: height * 0.9,
    width: "100%",
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 40,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 900,
  },

  mobileContent: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  textContainer: {
    flex: 1,
    marginRight: 40,
  },

  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,

    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },

  titleMobile: {
    fontSize: 34,
  },

  subtitle: {
    fontSize: 18,
    color: "#eaeaea",
    lineHeight: 26,
    maxWidth: 500,
  },

  subtitleMobile: {
    fontSize: 16,
  },

  play: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4C6EF5",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  playText: {
    fontSize: 40,
    color: "white",
    marginLeft: 6,
  },

  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  close: {
    position: "absolute",
    top: 60,
    right: 40,
    zIndex: 10,
  },

  closeText: {
    fontSize: 32,
    color: "white",
  },

  video: {
    width: width < 768 ? width * 0.9 : width * 0.6,
    height: width < 768 ? width * 0.5 : width * 0.35,
    borderRadius: 12,
  },

});