'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import api from '@/lib/api';
import { ProductsFilters } from '@/components/dashboard/products/products-filters';
import { ProductsTable } from '@/components/dashboard/products/products-table';

export default function Page(): React.JSX.Element {
  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [newProduct, setNewProduct] = React.useState({
    name: '',
    description: '',
    price: '',
    category: '',
    attributes: {
      color: '',
      size: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchProducts = React.useCallback(async () => {
    try {
      let response;
      if (searchQuery) {
        response = await api.get(`/products/search?query=${searchQuery}&page=${page + 1}&limit=${rowsPerPage}`);
      } else {
        response = await api.get(`/products?page=${page + 1}&limit=${rowsPerPage}`);
      }

      setProducts(response.data.items);
      setTotalProducts(response.data.total);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [page, rowsPerPage, searchQuery]);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async () => {
    if (!newProduct.name.trim() || !selectedFile) {
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('price', newProduct.price);
      formData.append('category', newProduct.category);
      formData.append('attributes', JSON.stringify(newProduct.attributes));

      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        setIsCreateModalOpen(false);
        setNewProduct({
          name: '',
          description: '',
          price: '',
          category: '',
          attributes: {
            color: '',
            size: '',
          },
        });
        setSelectedFile(null);
        router.push(`/dashboard/products/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleInputChange = (field: string, value: string) => {
    setNewProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAttributeChange = (field: string, value: string) => {
    setNewProduct((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [field]: value,
      },
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const showEmptyState = totalProducts === 0;

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Products</Typography>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add
          </Button>
        </div>
      </Stack>

      <ProductsFilters onSearch={handleSearch} />

      {showEmptyState ? (
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            p: 3,
          }}
        >
          <Typography color="text.secondary" variant="body1">
            No products found
          </Typography>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            sx={{ mt: 2 }}
            variant="contained"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add your first product
          </Button>
        </Box>
      ) : (
        <>
          <ProductsTable
            count={totalProducts}
            page={page}
            rows={products}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </>
      )}

      <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} fullWidth>
        <DialogTitle>Create New Product</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              label="Product Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newProduct.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            <TextField
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={newProduct.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              variant="outlined"
              value={newProduct.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
            />
            <TextField
              label="Category"
              type="text"
              fullWidth
              variant="outlined"
              value={newProduct.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            />
            <TextField
              type="file"
              fullWidth
              variant="outlined"
              onChange={handleFileChange}
              inputProps={{
                accept: 'image/*',
              }}
            />
            <TextField
              label="Color"
              type="text"
              fullWidth
              variant="outlined"
              value={newProduct.attributes.color}
              onChange={(e) => handleAttributeChange('color', e.target.value)}
            />
            <TextField
              label="Size"
              type="text"
              fullWidth
              variant="outlined"
              value={newProduct.attributes.size}
              onChange={(e) => handleAttributeChange('size', e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateModalOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleAddProduct}
            variant="contained"
            disabled={
              !newProduct.name ||
              !newProduct.description ||
              !newProduct.price ||
              !newProduct.category ||
              !selectedFile ||
              isSubmitting
            }
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
