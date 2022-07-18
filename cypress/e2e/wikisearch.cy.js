import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

describe('Advanced search specs', () => {

  dayjs.extend(customParseFormat)
  const query_text = 'football'
  const random_id = (number) => Cypress._.random(0, number)

  it('Checks redirection to advanced search', () => {

    cy.visit('https://en.wikipedia.org/wiki/Main_Page')
    cy.get('#searchButton').click()
    cy.url().should('include','Special')

  })
  
  it('Checks Exact Text Search', () => {
   
    cy.get('.mw-advancedSearch-searchPreview').as('SearchFilter').contains('Sort by relevance')
    cy.get('@SearchFilter').click()
    cy.get('#ooui-37').as('ExactTextField').type(query_text)
    cy.get('.oo-ui-inputWidget-input > .oo-ui-labelElement-label').as('SearchButton').click()
    cy.get('@SearchFilter').should('contain.text',query_text)
    cy.get('.searchresult').eq(random_id(19)).contains(query_text,{ matchCase: false})

  })

  it('Checks Max Results For Page', () => {

    cy.get('.mw-numlink').contains('500').click()
    cy.get('.searchresult').eq(random_id(499)).contains(query_text,{matchCase:false})

  })

  it('Checks File Type Search', () => {

    cy.get('.mw-advancedSearch-searchPreview').as('SearchFilter').click()
    cy.get('#ooui-64').as('FileType').click()
    cy.get('.oo-ui-labelElement-label').contains('png').click({force: true})
    cy.get('.oo-ui-inputWidget-input > .oo-ui-labelElement-label').as('SearchButton').click()
    cy.get('.searchResultImage a').eq(random_id(19)).should('have.attr', 'href').and('contains', 'png',{matchCase:false})

  })

  it('Checks Sorting Order Search', () => { 

    cy.get('.mw-advancedSearch-searchPreview').as('SearchFilter').click()
    cy.get('#ooui-82').as('Sorting order').click()
    cy.get('.oo-ui-labelElement-label').contains('Edit date').click({force: true})
    cy.get('.oo-ui-inputWidget-input > .oo-ui-labelElement-label').as('SearchButton').click()
    cy.get('.mw-search-result-data').eq(0).invoke('text').then(firstDate => {

      const postDate = firstDate.split('-')
      const today = dayjs(new Date());
      const postdate = dayjs(postDate[1],'HH:mm, DD MMMM YYYY')
      expect(postdate.isBefore(today)).to.be.true;

    })
    
  })

  it('Checks Clearing Filters', () => { 

    cy.get('.oo-ui-iconElement-icon.oo-ui-icon-close').eq(0).click({force:true})
    cy.get('.oo-ui-iconElement-icon.oo-ui-icon-close').eq(2).click({force:true})
    cy.get('.oo-ui-iconElement-icon.oo-ui-icon-close').eq(1).click({force:true})
    cy.get('.mw-advancedSearch-searchPreview').as('SearchFilter').should('not.have.text', 'File type image/png')

  })

})