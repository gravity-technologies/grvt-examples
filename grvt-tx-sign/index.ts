import path from 'path';
import prompts from 'prompts';
import CreateAccount from './CreateAccount';
import Transfer from './Transfer';

const methods = {
  CreateAccount,
  Transfer,
}

const selectMethods = async () => {
  const response = await prompts({
    type: 'select',
    name: 'method',
    min: 1,
    message: 'Select method to execute',
    choices: Object.keys(methods).map((key) => ({
      title: key,
      value: key,
      disabled: false,
      selected: false
      // description: `Execute key ${key}`
    }))
  })
  return response.method as keyof typeof methods
}

selectMethods().then((method) => {
  console.log(`Executing ${method}`)
  methods[method]()
  console.log('Open this file to see full script:', path.join(process.cwd(), `${method}.ts`))
  process.exit(0)
})

// prevent the process from exiting
setInterval(() => void 0, 1000)