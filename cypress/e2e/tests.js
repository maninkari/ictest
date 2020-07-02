/* 
test data in cypress/test-data/customers.txt:

{"latitude":"52.986375","user_id":101,"name":"user A","longitude":"-6.043701"} -> distance in Km: 41.76872550099624
{"latitude":"53.807778","user_id":21,"name":"user B","longitude":"-7.714444"} -> distance in Km: 109.37645542991697
{"latitude":"51.8856167","user_id":3,"name":"user C","longitude":"-10.4240951"} -> distance in Km: 324.37491200827054
*/

context('E2E tests', () => {
  it('file with test data exists', () => {
    cy.readFile('cypress/test-data/customers.txt').should('exist')
  })

  it('output.txt file with expected data is created', () => {
    cy.exec('./index.js --file=cypress/test-data/customers.txt')
    cy.readFile('out.txt')
      .should('exist')
      .should(($output) => {
        let users = $output.trim().split('\n')
        expect(users).to.have.length(1)
        expect(users[0]).to.have.string('101\tuser A')
      })
  })

  it('users within a 100Km radius from the Dublin office can be filtered', () => {
    cy.exec('./index.js --file=cypress/test-data/customers.txt --out')
      .its('stdout')
      .should(($output) => {
        let users = $output.split('\n')
        expect(users).to.have.length(1)
        expect(users[0]).to.have.string('101\tuser A')
      })
  })

  it('list of filtered users is sorted by user Id', () => {
    cy.exec(
      './index.js --file=cypress/test-data/customers.txt --out --distance=400'
    )
      .its('stdout')
      .should(($output) => {
        let users = $output.split('\n')
        expect(users).to.have.length(3)

        for (let i = 0; i < users.length - 1; i++) {
          let usrId1 = parseInt(users[i].split('\t')[0])
          let usrId2 = parseInt(users[i + 1].split('\t')[0])
          expect(usrId1).to.be.lessThan(usrId2)
        }
      })
  })

  it('list of users can be read from stdin', () => {
    cy.exec('cat cypress/test-data/customers.txt | ./index.js --in --out')
      .its('stdout')
      .should(($output) => {
        let users = $output.split('\n')
        expect(users).to.have.length(1)
        expect(users[0]).to.have.string('101\tuser A')
      })
  })
})
