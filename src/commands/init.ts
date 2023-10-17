import { writeFileSync } from 'node:fs'

type Options = { project: string }

export default function (options: Options): void {
  writeFileSync(
    options.project + '/example.wlk',
    `object aWollok {
    method howAreYou() {
      return "I am Wolloktastic!"
    }
} `,
  )
}
