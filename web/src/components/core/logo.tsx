'use client';

import * as React from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { NoSsr } from '@/components/core/no-ssr';

const HEIGHT = 60;
const WIDTH = 60;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function Logo({ color = 'dark', emblem, height = HEIGHT, width = WIDTH }: LogoProps): React.JSX.Element {
  return <Image src="/assets/logo.svg" alt="PopCorn.ai" width={width} height={height} priority />;
}

export interface DynamicLogoProps {
  colorDark?: Color;
  colorLight?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function DynamicLogo({
  colorDark = 'light',
  colorLight = 'dark',
  height = HEIGHT,
  width = WIDTH,
  ...props
}: DynamicLogoProps): React.JSX.Element {
  return (
    <NoSsr fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />}>
      <Box component="span" sx={{ color: '#000000' }}>
        Popcorn
      </Box>
    </NoSsr>
  );
}
