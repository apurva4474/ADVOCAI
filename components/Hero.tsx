import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import { useEffect, useRef, useState } from "react";

import {
  Animated,
  Easing,
  ImageBackground,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { heroStyles } from "../styles/components/herostyles";

export default function Hero() {

  const pulse = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(40)).current;

  const [open, setOpen] = useState(false);

  useEffect(() => {

    Animated.parallel([

      Animated.timing(fade, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),

      Animated.timing(slide, {
        toValue: 0,
        duration: 1200,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),

    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.15,
          duration: 900,
          easing: Easing.ease,
          useNativeDriver: true,
        }),

        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

  }, []);

  return (

    <ImageBackground
      source={require("../assets/images/hero.avif")}
      style={heroStyles.hero}
      resizeMode="cover"
    >

      <View style={heroStyles.darkOverlay} />

      <BlurView intensity={35} style={heroStyles.overlay}>

        <Animated.View
          style={[
            heroStyles.content,
            {
              opacity: fade,
              transform: [{ translateY: slide }],
            },
          ]}
        >

          {/* LEFT SIDE */}
          <View style={heroStyles.textContainer}>

            <Text style={heroStyles.title}>
              Revolutionizing{"\n"}
              Legal Research{"\n"}
              with AI
            </Text>

            <Text style={heroStyles.subtitle}>
              Simplify legal workflows, summarize complex
              case files, and generate strong legal arguments
              instantly using ADVOC-AI.
            </Text>

            <View style={heroStyles.buttonRow}>

              <TouchableOpacity style={heroStyles.primaryBtn}>
                <Text style={heroStyles.primaryBtnText}>
                  Get Started
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={heroStyles.secondaryBtn}
                onPress={() => setOpen(true)}
              >
                <Text style={heroStyles.secondaryBtnText}>
                  Watch Demo
                </Text>
              </TouchableOpacity>

            </View>

          </View>

          {/* RIGHT SIDE */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setOpen(true)}
          >

            <Animated.View
              style={[
                heroStyles.playWrapper,
                {
                  transform: [{ scale: pulse }],
                },
              ]}
            >

              <View style={heroStyles.playCircle}>
                <Text style={heroStyles.playIcon}>▶</Text>
              </View>

            </Animated.View>

          </TouchableOpacity>

        </Animated.View>

      </BlurView>

      {/* VIDEO MODAL */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
      >

        <View style={heroStyles.modalContainer}>

          <TouchableOpacity
            style={heroStyles.closeBtn}
            onPress={() => setOpen(false)}
          >
            <Text style={heroStyles.closeText}>×</Text>
          </TouchableOpacity>

          <Video
            source={require("../assets/images/video.mp4")}
            style={heroStyles.video}
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