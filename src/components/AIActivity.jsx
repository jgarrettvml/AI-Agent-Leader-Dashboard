import React from 'react'
import { Box, Table, Thead, Tbody, Tr, Th, Td, Input, Select, HStack, Text, Center, Spinner } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function AIActivity() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('timestamp')

  useEffect(() => {
    fetchActivities()
  }, [sortBy])

  async function fetchActivities() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('ai_activities')
        .select('*')
        .order(sortBy, { ascending: false })

      if (error) throw error
      setActivities(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredActivities = activities.filter(activity =>
    activity.action?.toLowerCase().includes(filter.toLowerCase()) ||
    activity.agent_id?.toLowerCase().includes(filter.toLowerCase()) ||
    activity.details?.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <Box>
      <HStack spacing={4} mb={6}>
        <Input
          placeholder="Filter by action, agent, or details"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="timestamp">Time</option>
          <option value="action">Action</option>
          <option value="agent_id">Agent ID</option>
        </Select>
      </HStack>

      {loading ? (
        <Center py={8}>
          <Spinner />
        </Center>
      ) : filteredActivities.length === 0 ? (
        <Center py={8}>
          <Text>No AI activities found</Text>
        </Center>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Time</Th>
                <Th>Agent ID</Th>
                <Th>Action</Th>
                <Th>Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredActivities.map((activity) => (
                <Tr key={activity.id}>
                  <Td>{new Date(activity.timestamp).toLocaleString()}</Td>
                  <Td>{activity.agent_id}</Td>
                  <Td>{activity.action}</Td>
                  <Td>{activity.details}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  )
}
