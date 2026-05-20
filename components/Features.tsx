import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef } from "react";

import {
  Animated,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { featuresStyles } from "../styles/components/featuresStyles";

export default function Features() {

  const router = useRouter();

  const scale1 = useRef(new Animated.Value(1)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const scale3 = useRef(new Animated.Value(1)).current;

  const animateIn = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const features = [
    {
      emoji: "📄",
      title: "Document Summariser",
      text: "Upload legal PDFs and get accurate AI summaries instantly.",
      route: "/summarizer",
      scale: scale1,
    },
    {
      emoji: "⚖️",
      title: "Argument Generator",
      text: "Generate strong and structured legal arguments with AI.",
      route: "/argument",
      scale: scale2,
    },
    {
      emoji: "📅",
      title: "Timeline Builder",
      text: "Organize important case events in chronological order.",
      route: "/calendar",
      scale: scale3,
    },
  ];

  return (
    <View style={featuresStyles.container}>

      <Text style={featuresStyles.heading}>
        Powerful AI Tools
      </Text>

      <Text style={featuresStyles.subheading}>
        Smart legal assistance designed for speed and precision.
      </Text>

      <View style={featuresStyles.cardContainer}>

        {features.map((item, index) => (

          <Animated.View
            key={index}
            style={{
              transform: [{ scale: item.scale }],
              flex: 1,
            }}
          >

            <LinearGradient
              colors={["rgba(212,175,55,0.5)", "rgba(255,255,255,0.03)"]}
              style={featuresStyles.gradientBorder}
            >

              <TouchableOpacity
                activeOpacity={0.9}
                style={featuresStyles.card}
                onPressIn={() => animateIn(item.scale)}
                onPressOut={() => animateOut(item.scale)}
                onPress={() => router.push(item.route as any)}
              >

                <Text style={featuresStyles.icon}>
                  {item.emoji}
                </Text>

                <Text style={featuresStyles.title}>
                  {item.title}
                </Text>

                <Text style={featuresStyles.text}>
                  {item.text}
                </Text>

              </TouchableOpacity>

            </LinearGradient>

          </Animated.View>

        ))}

      </View>

    </View>
  );
}