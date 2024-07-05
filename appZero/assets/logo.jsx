import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useColorScheme } from 'react-native';

const LogoBackground = ({ width, height }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const fillColor = isDarkMode ? 'white' : 'black';

  return (
    <Svg width={width} height={height} viewBox="0 0 225 301" fill="none">
      <Path
        d="M179.668 150.354L129.343 54.2042L117.993 75.5417L157.46 150.354L90.1102 278.892L22.7726 150.354L101.46 0.479248H79.0305L0.564209 150.354L79.0183 300.479H101.214L179.668 150.354ZM224.564 150.354L145.865 0.479248H123.668L45.2144 150.354L95.7851 246.754L106.889 225.417L67.6684 150.354L134.773 22.0667L202.11 150.354L123.668 300.479H145.865L224.564 150.354Z"
        fill={fillColor}
      />
    </Svg>
  );
};

export default LogoBackground;
