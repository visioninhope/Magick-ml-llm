import * as React from 'react'

import Home from './screens/Home'
import Completions from './completions'
import NewFineTune from './screens/NewFineTune'
import CompletionDetails from './completions/CompletionDetails'

import { Plugin } from '@magickml/engine'

const FineTuneManager = new Plugin({
  name: 'FineTuneManagerPlugin',
  clientRoutes: [
    {
      path: '/fineTuneManager',
      component: Home,
    },
    {
      path: '/fineTuneManager/completions',
      component: Completions,
    },
    {
      path: '/fineTuneManager/fine-tunes/new',
      component: NewFineTune,
    },
    {
      path: '/fineTuneManager/fine-tune/:fineTuneId',
      component: CompletionDetails,
    },
  ],
})

export default FineTuneManager