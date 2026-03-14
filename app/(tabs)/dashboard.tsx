import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";
import { ScrollView } from "react-native";
export default function Dashboard() {
  return (
    <ScrollView>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
    </ScrollView>
  );
}