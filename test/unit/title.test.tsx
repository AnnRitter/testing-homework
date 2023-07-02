import {it, expect} from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from 'react-redux'
import {initStore} from '../../src/client/store'
import {Application} from '../../src/client/Application'
import { CartApi, ExampleApi } from '../../src/client/api'
import React from "react"
import events from '@testing-library/user-event'
    
const basename = '/hw/store';
const api = new ExampleApi(basename);
let cart = new CartApi();
const store = initStore(api, cart);

it('название магазина в шапке должно быть ссылкой на главную страницу', async () => {

    const application = (
        <BrowserRouter basename={basename}>
            <Provider store={store}>
                <Application />
            </Provider>
        </BrowserRouter>
      );
  
      const {container} = render(application)
      let elem = container.querySelector('.navbar-brand')
      
     let link = screen.getByRole('link', {name: 'Example store'})

      await events.click(link)
    
   expect(link.getAttribute('href')).toBe('/hw/store/')
})