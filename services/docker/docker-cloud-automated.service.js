import { BaseJsonService } from '../index.js'
import { dockerBlue, buildDockerUrl } from './docker-helpers.js'
import { fetchBuild } from './docker-cloud-common-fetch.js'

export default class DockerCloudAutomatedBuild extends BaseJsonService {
  static category = 'build'
  static route = buildDockerUrl('cloud/automated')

  static auth = {
    userKey: 'dockerhub_username',
    passKey: 'dockerhub_pat',
    authorizedOrigins: ['https://hub.docker.com', 'https://cloud.docker.com'],
    isRequired: false,
  }

  static examples = [
    {
      title: 'Docker Cloud Automated build',
      documentation: '<p>For the new Docker Hub (https://cloud.docker.com)</p>',
      namedParams: {
        user: 'jrottenberg',
        repo: 'ffmpeg',
      },
      staticPreview: this.render({ buildSettings: ['test'] }),
    },
  ]

  static _cacheLength = 14400

  static defaultBadgeData = { label: 'docker build' }

  static render({ buildSettings }) {
    if (buildSettings.length >= 1) {
      return { message: 'automated', color: dockerBlue }
    }
    return { message: 'manual', color: 'yellow' }
  }

  async handle({ user, repo }) {
    const data = await fetchBuild(this, { user, repo })

    if (data.objects.length === 0) {
      return this.constructor.render({
        buildSettings: [],
      })
    }
    return this.constructor.render({
      buildSettings: data.objects[0].build_settings,
    })
  }
}
