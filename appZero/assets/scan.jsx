import Svg, { Path } from 'react-native-svg';

const CameraIcon = ({ size, isDarkMode }) => (
  <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
    <Path
      d="M21 16v5H3v-5h2v3h14v-3h2zM3 11h18v2H3v-2zm18-3h-2V5H5v3H3V3h18v5z"
      fill={isDarkMode ? 'black' : 'white'}
    />
  </Svg>
);

export default CameraIcon;