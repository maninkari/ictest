/*
𝜃 = longitude in Radians
ϕ = latitude in Radians
R = radius

Point P1 = R*{cos(𝜃)*cos(ϕ), sin(𝜃)*cos(ϕ), sin(ϕ)}

cos(α) = P1 . P2 = P1 * P2 / |P1| |P2| 

If P1 and P2 are unitVectors -> 

cos(α) = P1 . P2 = P1 * P2 / |P1| |P2| = P1 * P2

α = acos( P1*P2 )

distance between points = R * α
*/

const dotProduct = (v1, v2) => {
  return v1
    .map((x, i) => {
      return v1[i] * v2[i]
    })
    .reduce((m, n) => {
      return m + n
    })
}

const magnitude = (v) => {
  return Math.sqrt(dotProduct(v, v))
}

const distance = (R, lat1, long1, lat2, long2) => {
  let v1 = unitVector(lat1, long1)
  let v2 = unitVector(lat2, long2)
  let cos_α = dotProduct(v1, v2) // no need to divide by |v1| and |v2|

  return R * Math.acos(cos_α)
}

const unitVector = (latitude, longitude) => {
  let 𝜃 = longitude * Math.PI / 180
  let ϕ = latitude * Math.PI / 180  
  return [Math.cos(𝜃) * Math.cos(ϕ), Math.sin(𝜃) * Math.cos(ϕ), Math.sin(ϕ)]
}

const distanceFormula = (R, lat1, long1, lat2, long2) => {
  let 𝜃1 = long1 * Math.PI / 180
  let ϕ1 = lat1 * Math.PI / 180 
  let 𝜃2 = long2 * Math.PI / 180
  let ϕ2 = lat2 * Math.PI / 180 

  let α = Math.acos(
      Math.sin(ϕ1) * Math.sin(ϕ2) +
      Math.cos(ϕ1) * Math.cos(ϕ2) * Math.cos(𝜃2-𝜃1)
  )

  return R*α
}

exports.distance = distanceFormula
