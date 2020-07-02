/*
𝜃 = longitude in Radians
ϕ = latitude in Radians
R = radius

Point P = R*{cos(𝜃)*cos(ϕ), sin(𝜃)*cos(ϕ), sin(ϕ)}

cos(α) = P1 . P2 = P1 * P2 / |P1| |P2| 

If P1 and P2 are unitVectors -> P1| = |P2| = 1 ->

cos(α) = P1 . P2 = P1 * P2 / |P1| |P2| = P1 * P2

α = acos( P1*P2 )

distance between points = R * α

distanceDotProduct can be simplified to distanceFormula 
*/

const distanceFormula = (R, lat1, long1, lat2, long2) => {
  let 𝜃1 = long1 * Math.PI / 180
  let ϕ1 = lat1 * Math.PI / 180 
  let 𝜃2 = long2 * Math.PI / 180
  let ϕ2 = lat2 * Math.PI / 180 

  let α = Math.acos(
      Math.sin(ϕ1) * Math.sin(ϕ2) +
      Math.cos(ϕ1) * Math.cos(ϕ2) * Math.cos(𝜃2-𝜃1)
  )

  return R * α
}

exports.distance = distanceFormula
