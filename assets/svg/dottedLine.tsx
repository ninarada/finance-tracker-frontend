import { View } from 'react-native';
import { Line, Svg } from 'react-native-svg';

const DottedLine = () => (
  <View style={{ flex: 1, height: 1, justifyContent: 'flex-end' }}>
    <Svg height="1" width="100%">
      <Line
        x1="0"
        y1="0"
        x2="100%"
        y2="0"
        stroke="#94a3b8"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
    </Svg>
  </View>
);

export default DottedLine;
