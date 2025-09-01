// Delete it, just for checking whether the code is working or not

import React from 'react'
import { Box, Container, Paper, Typography, Chip } from '@mui/material'

export default function About() {
    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: 3 }}>
            <Container maxWidth="md">
                <Paper sx={{ p: 4, borderRadius: 2, border: '1px solid #e5e7eb' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                        About
                    </Typography>
                    <Chip label="MainSync" size="small" sx={{ mb: 2, bgcolor: '#eef2ff', color: '#2563eb', fontWeight: 'bold' }} />
                    <Typography variant="body1" color="text.secondary">
                        This is the about page of the application.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}