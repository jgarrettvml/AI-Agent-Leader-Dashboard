import React from 'react'
import { Box, Table, Thead, Tbody, Tr, Th, Td, Input, Select, HStack, Text, Center, Spinner } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function UserActivity() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('created_at')

  useEffect(() => {
    // Test Supabase connection immediately
    testConnection()
    fetchActivities()
  }, [sortBy])

  async function testConnection() {
    try {
      console.log('Testing Supabase connection...')
      const { data, error } = await supabase
        .from('user_activity')
        .select('count')
      
      if (error) {
        console.error('Connection test error:', error)
      } else {
        console.log('Connection successful, row count:', data)
      }
    } catch (err) {
      console.error('Connection test failed:', err)
    }
  }

  async function fetchActivities() {
    try {
      setLoading(true)
      console.log('Fetching user activities...')
      
      // Log the query we're about to make
      console.log('Query:', {
        table: 'user_activity',
        sort: sortBy,
        direction: 'desc'
      })

      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .order(sortBy, { ascending: false })

      if (error) {
        console.error('Fetch error:', error)
        return
      }

      console.log('Fetched data:', data)
      setActivities(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Log whenever activities state changes
  useEffect(() => {
    console.log('Activities state updated:', activities)
  }, [activities])

  const filteredActivities = activities.filter(activity =>
    activity.action?.toLowerCase().includes(filter.toLowerCase()) ||
    activity.user_id?.toLowerCase().includes(filter.toLowerCase()) ||
    activity.city?.toLowerCase().includes(filter.toLowerCase()) ||
    activity.country?.toLowerCase().includes(filter.toLowerCase())
  )

  // Log whenever filtered results change
  useEffect(() => {
    console.log('Filtered activities:', filteredActivities)
  }, [filteredActivities])

  return (
    <Box>
      <HStack spacing={4} mb={6}>
        <Input
          placeholder="Filter by action, user, city, or country"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="created_at">Time</option>
          <option value="action">Action</option>
          <option value="user_id">User ID</option>
          <option value="country">Country</option>
        </Select>
      </HStack>

      {loading ? (
        <Center py={8}>
          <Spinner />
        </Center>
      ) : filteredActivities.length === 0 ? (
        <Center py={8}>
          <Text>No user activities found</Text>
        </Center>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Time</Th>
                <Th>User ID</Th>
                <Th>Action</Th>
                <Th>Details</Th>
                <Th>Location</Th>
                <Th>IP</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredActivities.map((activity) => (
                <Tr key={activity.id}>
                  <Td>{new Date(activity.created_at).toLocaleString()}</Td>
                  <Td>{activity.user_id}</Td>
                  <Td>{activity.action}</Td>
                  <Td>{activity.details}</Td>
                  <Td>
                    {[activity.city, activity.region, activity.country]
                      .filter(Boolean)
                      .join(', ')}
                  </Td>
                  <Td>{activity.ip}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  )
}
