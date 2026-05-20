import { Text, View } from "react-native";
import { howStyles } from "../styles/components/howStyles";

export default function HowItWorks() {

  const steps = [
    {
      number: "1",
      title: "Upload Case File",
      text: "Upload legal PDFs or documents securely.",
    },
    {
      number: "2",
      title: "AI Analysis",
      text: "AI extracts key legal insights instantly.",
    },
    {
      number: "3",
      title: "Get Results",
      text: "Receive summaries and arguments quickly.",
    },
  ];

  return (
    <View style={howStyles.container}>

      <Text style={howStyles.heading}>
        How ADVOC-AI Works
      </Text>

      <Text style={howStyles.subheading}>
        Fast. Smart. AI-powered legal assistance.
      </Text>

      <View style={howStyles.steps}>

        {steps.map((step, index) => (
          <View key={index} style={howStyles.card}>

            <View style={howStyles.circle}>
              <Text style={howStyles.circleText}>
                {step.number}
              </Text>
            </View>

            <Text style={howStyles.title}>
              {step.title}
            </Text>

            <Text style={howStyles.text}>
              {step.text}
            </Text>

          </View>
        ))}

      </View>

    </View>
  );
}