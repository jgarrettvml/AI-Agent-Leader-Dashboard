import React from 'react'
import { Box, Button, HStack, VStack, Container, Heading } from '@chakra-ui/react'
import { useState } from 'react'
import AIActivity from './components/AIActivity'
import Leaderboard from './components/Leaderboard'

export default function App() {
  const [view, setView] = useState('activity')

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <Heading size="xl" color="gray.700">Game Dashboard</Heading>
          
          <HStack spacing={4}>
            <Button
              size="lg"
              colorScheme={view === 'activity' ? 'blue' : 'gray'}
              onClick={() => setView('activity')}
            >
              AI Activity
            </Button>
            <Button
              size="lg"
              colorScheme={view === 'leaderboard' ? 'blue' : 'gray'}
              onClick={() => setView('leaderboard')}
            >
              Leaderboard
            </Button>
          </HStack>

          <Box w="full" bg="white" p={6} borderRadius="lg" shadow="md">
            {view === 'activity' ? <AIActivity /> : <Leaderboard />}
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
