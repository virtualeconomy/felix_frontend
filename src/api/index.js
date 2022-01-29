import request from './request'

export const reqRandomWords = (n=10) => request({
  method: 'GET',
  url: `/random/${n}`
})
export const reqLemmaWord = (word) => request({
  method: 'GET',
  url: '/lemma/' + word,
})
export const reqGetBalance = () => request({
  method: 'GET',
  url: '/balance',
})
export const reqSaveWordId = (wordIdArr) => request({
  method: 'post',
  url: '/save',
  data: wordIdArr
})
export const reqInspectNft = (data) => request({
  method: 'post',
  url: '/inspectnft',
  // data: ["TWst8k7NgZNzxiXSncex9uvSzt4kSaJZE8qwUDg8M", "TWst8k7NgZNzxiXSncex9uvSzt4kSaJZE8r3B7pgP"]
})
export const reqFetchDefinition = (data) => request({
  method: 'post',
  url: '/fetchdefinition',
  // data: ["G5whHKUn6ejMQAnLEjMH6cqNnkeZMkc4kAbiFtKYmZkG"]
})
export const reqMakeNft = (wordIdArr) => request({
  method: 'post',
  url: '/makenft',
  data: {'ATwAPYdriV1aRXAWYmLViW7Y6K5Jb5bZDkT': wordIdArr}
})