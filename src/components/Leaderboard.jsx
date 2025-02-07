import React from 'react'
import { Box, Table, Thead, Tbody, Tr, Th, Td, Input, Select, HStack, Text, Center, Spinner } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function Leaderboard() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('score')

  useEffect(() => {
    fetchScores()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('leaderboard_channel')
      .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'leaderboard' },
          payload => {
            setScores(current => [payload.new, ...current])
          }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [sortBy])

  async function fetchScores() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order(sortBy, { ascending: sortBy === 'player_name' })

      if (error) throw error
      setScores(data || [])
    } catch (error) {
      console.error('Error fetching scores:', error)
    } finally {
      setLoading(false)
    }
  }

  // Insert mock data function
  async function insertMockData() {
    const mockScores = [
      { player_name: 'Player1', score: 1000 },
      { player_name: 'Player2', score: 850 },
      { player_name: 'Player3', score: 1200 }
    ]

    for (const score of mockScores) {
      const { error } = await supabase
        .from('leaderboard')
        .insert([score])
      
      if (error) console.error('Error inserting score:', error)
    }
  }

  // Insert mock data on component mount (only if no data exists)
  useEffect(() => {
    if (scores.length === 0 && !loading) {
      insertMockData()
    }
  }, [loading])

  const filteredScores = scores.filter(score =>
    score.player_name?.toLowerCase().includes(filter.toLowerCase())
  )

  if (loading) {
    return (
      <Center py={8}>
        <Spinner />
      </Center>
    )
  }

  return (
    <Box>
      <HStack spacing={4} mb={6}>
        <Input
          placeholder="Filter by player name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="score">Score</option>
          <option value="player_name">Player Name</option>
          <option value="timestamp">Time</option>
        </Select>
      </HStack>

      {filteredScores.length === 0 ? (
        <Center>
          <Text>No scores found</Text>
        </Center>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Rank</Th>
              <Th>Player</Th>
              <Th>Score</Th>
              <Th>Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredScores.map((score, index) => (
              <Tr key={score.id}>
                <Td>{index + 1}</Td>
                <Td>{score.player_name}</Td>
                <Td>{score.score}</Td>
                <Td>{new Date(score.timestamp).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  )
}
