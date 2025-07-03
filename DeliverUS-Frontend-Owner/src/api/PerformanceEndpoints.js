// This is a new file for solution!
import { get, post, put, destroy } from './helpers/ApiRequestsHelper'

function create (data) {
  return post('performances', data)
}

export { create }
