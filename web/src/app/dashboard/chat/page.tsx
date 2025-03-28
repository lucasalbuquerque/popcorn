'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PaperPlaneRight as SendIcon } from '@phosphor-icons/react/dist/ssr/PaperPlaneRight';

import api from '@/lib/api';

interface Message {
  id: string;
  content: string | React.ReactNode;
  sender: 'user' | 'ai';
  timestamp: Date;
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
}

export default function Page(): React.JSX.Element {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      content: "Hi. I'm Popcorn AI, your AI assistant. Let me know how I can help you.",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await api.post('/chat', {
        query: inputValue,
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your request.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack sx={{ height: 'calc(100vh - 150px)' }}>
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          mb: 2,
          p: 2,
          overflowY: 'auto',
          backgroundColor: 'var(--mui-palette-background-default)',
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            <Paper
              sx={{
                p: 2,
                maxWidth: message.tableData ? '90%' : '70%',
                backgroundColor: message.sender === 'user' ? 'var(--mui-palette-primary-main)' : '#f0f0f0',
                color: message.sender === 'user' ? 'white' : 'inherit',
                borderRadius: 2,
                whiteSpace: 'pre-wrap',
              }}
            >
              <Typography>{message.content}</Typography>
              {message.tableData && (
                <TableContainer component={Paper} sx={{ mt: 2, maxWidth: '100%' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {message.tableData.headers.map((header, index) => (
                          <TableCell key={index} sx={{ fontWeight: 'bold' }}>
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {message.tableData.rows.map((row, index) => (
                        <TableRow key={index}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Paper sx={{ p: 2, backgroundColor: '#f0f0f0', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography>Thinking...</Typography>
              </Box>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Paper>

      <Paper
        elevation={2}
        sx={{
          p: 2,
          backgroundColor: 'var(--mui-palette-background-paper)',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            placeholder={'Ask Popcorn AI...'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
            variant="outlined"
            size="small"
            autoComplete="off"
          />
          <IconButton
            onClick={handleSend}
            color="primary"
            sx={{
              backgroundColor: 'var(--mui-palette-primary-main)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'var(--mui-palette-primary-dark)',
              },
              '&.Mui-disabled': {
                backgroundColor: 'var(--mui-palette-action-disabledBackground)',
                color: 'var(--mui-palette-action-disabled)',
              },
            }}
          >
            <SendIcon fontSize="var(--icon-fontSize-md)" />
          </IconButton>
        </Stack>
      </Paper>
    </Stack>
  );
}
