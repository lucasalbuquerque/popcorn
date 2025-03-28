'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowClockwise as RefreshIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { WarningCircle } from '@phosphor-icons/react/dist/ssr/WarningCircle';

import api from '@/lib/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  attributes?: {
    color?: string;
    size?: string;
    [key: string]: any;
  };
}

export default function ProductPage(): React.JSX.Element {
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const params = useParams();

  const productId = String(params?.id);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchProduct();
    } catch (error) {
      console.error('Error refreshing product:', error);
    } finally {
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh', pt: 8 }}>
        <WarningCircle size={64} weight="light" color="#666" />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Product not found
        </Typography>
      </Box>
    );
  }

  const imageUrl = product.imageUrl.startsWith('http')
    ? product.imageUrl
    : `${process.env.NEXT_PUBLIC_API_URL}${product.imageUrl}`;

  return (
    <Stack spacing={3}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Typography variant="h4" fontWeight={600}>
              {product.name}
            </Typography>
            <Button
              startIcon={
                refreshing ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon fontSize="1.5rem" />
              }
              variant="outlined"
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{ ml: 'auto' }}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Stack>

          <Box>
            <img src={imageUrl} alt={product.name} style={{ maxWidth: '100%', height: 'auto' }} />
          </Box>

          <Stack spacing={2}>
            <Typography variant="h6">Description</Typography>
            <Typography variant="body1">{product.description}</Typography>

            <Typography variant="h6">Details</Typography>
            <Stack spacing={1}>
              <Typography variant="body1">Price: ${product.price}</Typography>
              <Typography variant="body1">Category: {product.category}</Typography>
              {product.attributes && (
                <>
                  {product.attributes.color && (
                    <Typography variant="body1">Color: {product.attributes.color}</Typography>
                  )}
                  {product.attributes.size && <Typography variant="body1">Size: {product.attributes.size}</Typography>}
                  {Object.entries(product.attributes)
                    .filter(([key]) => !['color', 'size'].includes(key))
                    .map(([key, value]) => (
                      <Typography key={key} variant="body1">
                        {key}: {value}
                      </Typography>
                    ))}
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
