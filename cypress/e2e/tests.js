/* 
{"latitude":"52.986375","user_id":1,"name":"user A","longitude":"-6.043701"} -> distance:41.76872550099624
{"latitude":"53.807778","user_id":2,"name":"user B","longitude":"-7.714444"} -> distance:109.37645542991697
{"latitude":"51.8856167","user_id":3,"name":"user C","longitude":"-10.4240951"} -> distance:324.37491200827054
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
        expect(JSON.parse(users[0]).name).to.eq('user A')
        expect(JSON.parse(users[0]).distance).to.be.lessThan(100)
      })
  })

  it('users within a 100Km radius from the Dublin office can be selected', () => {
    cy.exec('./index.js --file=cypress/test-data/customers.txt --out')
      .its('stdout')
      .should(($output) => {
        let users = $output.split('\n')
        expect(users).to.have.length(1)
        expect(JSON.parse(users[0]).name).to.eq('user A')
        expect(JSON.parse(users[0]).distance).to.be.lessThan(100)
      })
  })

  it('users within a 400Km radius from the Dublin office can be selected', () => {
    cy.exec(
      './index.js --file=cypress/test-data/customers.txt --out --distance=400'
    )
      .its('stdout')
      .should(($output) => {
        let users = $output.split('\n')
        expect(users).to.have.length(3)
        users.map((u) => expect(JSON.parse(u).distance).to.be.lessThan(400))
      })
  })

  it('list of users can be read from stdin', () => {
    cy.exec('cat cypress/test-data/customers.txt | ./index.js --in --out')
      .its('stdout')
      .should(($output) => {
        let users = $output.split('\n')
        expect(users).to.have.length(1)
        expect(JSON.parse(users[0]).name).to.eq('user A')
        expect(JSON.parse(users[0]).distance).to.be.lessThan(100)
      })
  })
})
