import { Image } from 'expo-image';
import React from 'react';

interface GoogleLogoProps {
  size?: number;
}

export function GoogleLogo({ size = 20 }: GoogleLogoProps) {
  return (
    <Image
      source={require('@/assets/images/google.svg')}
      style={{ width: size, height: size }}
      contentFit="contain"
    />
  );
}
