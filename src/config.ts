'use strict'

const uiConfig = {
  SMALL_SCREEN_BREAKPOINT: 768,
  SMALL_SCREEN_CLASS: 'mwz-small',

  DEFAULT_PLACE_ICON: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArpJREFUeNrEl89rE0EUx98uwXqpBOxBREk8RRSTCIJ6yvZiPZUVbC+CGBWPhnrwj/BQqEexWoVeWqHFk/Xi5uIPEGwUxZzcUhUPFqI9aHpZ33f3bZxs3B+NSfqFyY/N5H3mzbx58yZFCeU4TprfDG5FbhluWfnJ5rbGbZWbpWlag3ohBhrclhxFzR+/nC/Pbbfhc0Doa8TZ1SKA8Oi+eEn1xRrZTz7S1xdr1Pz5u63v0J7dtP90hrJnD1NuouA/triVeQbsxGCGmgJNv7v7il5PVztgYcIgTtwo0bGrJ/G1IfDlWDBDLwG6+blBK1cW6Pv7b10t0cjRfTQ2O0nDBxAaLnwuFCyeLm0w7PHEw8ReRnk/vniR9vIgWOdUz7XAmr5hT9OPztz5b6gKP//0GjzHtB/311xX+rhriuntFRSCLdiEbWFQCyzhbyCIul3TKMEmbIPhbzXf48oWjwwR3C/B9pY3kxW8pCQjmZ9W6pFTfPnDTdrF6xUlGL535FbolIPB+9wEEx6bbt7j5BClOGiSPgrD1P2ci9H0WwojC3Bpow8BFSZhlXRv/psDA/ssnXZIupddhgYG9FkAVyWXDkTCqupSQfB5mu07VGHYuhzYdGgsF5sc4hTXR2FYmuTqZ/wnY/7U7dDsNXww7Z+tocIZvrneCD2lLry8jiSDumw0Jc9n+IGBqkGSeafR9XCjSQTbktketKJaDmgrzz+O9CHQYDPvlUKWX4mo+3gKIxqdHnenpXfbx7Mp3k617WPxGnVxGeGOcqUX8EDpUxZGZ+aSaWjBEVDdCv8NQOeSlLdupYnt8VbK2+14iUDK/w2mDmhcQV+UGqmIAdQXam5RH1YaIYBQzOcmCz5wNTi9icAB7ytyZ3KF20R7RsqoXwGa+ZeX2wIHyl9UKwXlwkbKxa3GbTnsyhLUHwEGAHTlTmav1n2rAAAAAElFTkSuQmCC',
}

const icons = {
  ACCESSIBLE: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4gICAgPHN0eWxlIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdHlwZT0idGV4dC9jc3MiPi5zdDF7ZmlsbDojMDAwMDAwO308L3N0eWxlPiAgICA8cGF0aCAgZmlsbD0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIvPjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjEyIiBjeT0iNCIgcj0iMiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOSAxM3YtMmMtMS41NC4wMi0zLjA5LS43NS00LjA3LTEuODNsLTEuMjktMS40M2MtLjE3LS4xOS0uMzgtLjM0LS42MS0uNDUtLjAxIDAtLjAxLS4wMS0uMDItLjAxSDEzYy0uMzUtLjItLjc1LS4zLTEuMTktLjI2QzEwLjc2IDcuMTEgMTAgOC4wNCAxMCA5LjA5VjE1YzAgMS4xLjkgMiAyIDJoNXY1aDJ2LTUuNWMwLTEuMS0uOS0yLTItMmgtM3YtMy40NWMxLjI5IDEuMDcgMy4yNSAxLjk0IDUgMS45NXptLTYuMTcgNWMtLjQxIDEuMTYtMS41MiAyLTIuODMgMi0xLjY2IDAtMy0xLjM0LTMtMyAwLTEuMzEuODQtMi40MSAyLTIuODNWMTIuMWMtMi4yOC40Ni00IDIuNDgtNCA0LjkgMCAyLjc2IDIuMjQgNSA1IDUgMi40MiAwIDQuNDQtMS43MiA0LjktNGgtMi4wN3oiLz48L3N2Zz4=',
  BADGE: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNzAuMDggMTcwLjA4Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6bm9uZTtzdHJva2U6IzAwMDAwMDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6MTNweDt9LnN0MXtmaWxsOiMwMDAwMDA7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT5iYWRnZTwvdGl0bGU+PGcgaWQ9ImJhZGdlIj48Y2lyY2xlIGNsYXNzPSJjbHMtMSIgY3g9Ijg0LjAzIiBjeT0iMTE3LjQiIHI9IjI0LjM4Ii8+PHBvbHlsaW5lIGNsYXNzPSJzdDEiIHBvaW50cz0iNzEuOSA5OS4xNCA3MS45IDI4LjMgOTQuMDEgMjguMyA5NC4wMSA0NS43NCAxMTAuNDMgNDUuNzQgMTEwLjQzIDU4LjAxIDk0LjAxIDU4LjMyIDk0LjAxIDk5LjY0Ii8+PC9nPjwvc3ZnPg==',
  BIKE: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48c3R5bGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB0eXBlPSJ0ZXh0L2NzcyI+LnN0MXtmaWxsOiMwMDAwMDA7fTwvc3R5bGU+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNS41IDUuNWMxLjEgMCAyLS45IDItMnMtLjktMi0yLTItMiAuOS0yIDIgLjkgMiAyIDJ6TTUgMTJjLTIuOCAwLTUgMi4yLTUgNXMyLjIgNSA1IDUgNS0yLjIgNS01LTIuMi01LTUtNXptMCA4LjVjLTEuOSAwLTMuNS0xLjYtMy41LTMuNXMxLjYtMy41IDMuNS0zLjUgMy41IDEuNiAzLjUgMy41LTEuNiAzLjUtMy41IDMuNXptNS44LTEwbDIuNC0yLjQuOC44YzEuMyAxLjMgMyAyLjEgNS4xIDIuMVY5Yy0xLjUgMC0yLjctLjYtMy42LTEuNWwtMS45LTEuOWMtLjUtLjQtMS0uNi0xLjYtLjZzLTEuMS4yLTEuNC42TDcuOCA4LjRjLS40LjQtLjYuOS0uNiAxLjQgMCAuNi4yIDEuMS42IDEuNEwxMSAxNHY1aDJ2LTYuMmwtMi4yLTIuM3pNMTkgMTJjLTIuOCAwLTUgMi4yLTUgNXMyLjIgNSA1IDUgNS0yLjIgNS01LTIuMi01LTUtNXptMCA4LjVjLTEuOSAwLTMuNS0xLjYtMy41LTMuNXMxLjYtMy41IDMuNS0zLjUgMy41IDEuNiAzLjUgMy41LTEuNiAzLjUtMy41IDMuNXoiLz48L3N2Zz4=',
  BOAT: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4gICAgPHN0eWxlPi5zdDF7ZmlsbDojMDAwMDAwfTwvc3R5bGU+ICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4gICAgPHBhdGggY2xhc3M9InN0MSIgZD0iTTIwIDIxYy0xLjM5IDAtMi43OC0uNDctNC0xLjMyLTIuNDQgMS43MS01LjU2IDEuNzEtOCAwQzYuNzggMjAuNTMgNS4zOSAyMSA0IDIxSDJ2MmgyYzEuMzggMCAyLjc0LS4zNSA0LS45OSAyLjUyIDEuMjkgNS40OCAxLjI5IDggMCAxLjI2LjY1IDIuNjIuOTkgNCAuOTloMnYtMmgtMnpNMy45NSAxOUg0YzEuNiAwIDMuMDItLjg4IDQtMiAuOTggMS4xMiAyLjQgMiA0IDJzMy4wMi0uODggNC0yYy45OCAxLjEyIDIuNCAyIDQgMmguMDVsMS44OS02LjY4Yy4wOC0uMjYuMDYtLjU0LS4wNi0uNzhzLS4zNC0uNDItLjYtLjVMMjAgMTAuNjJWNmMwLTEuMS0uOS0yLTItMmgtM1YxSDl2M0g2Yy0xLjEgMC0yIC45LTIgMnY0LjYybC0xLjI5LjQyYy0uMjYuMDgtLjQ4LjI2LS42LjVzLS4xNS41Mi0uMDYuNzhMMy45NSAxOXpNNiA2aDEydjMuOTdMMTIgOCA2IDkuOTdWNnoiLz48L3N2Zz4=',
  BUS: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48c3R5bGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB0eXBlPSJ0ZXh0L2NzcyI+LnN0MXtmaWxsOiMwMDAwMDA7fTwvc3R5bGU+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00IDE2YzAgLjg4LjM5IDEuNjcgMSAyLjIyVjIwYzAgLjU1LjQ1IDEgMSAxaDFjLjU1IDAgMS0uNDUgMS0xdi0xaDh2MWMwIC41NS40NSAxIDEgMWgxYy41NSAwIDEtLjQ1IDEtMXYtMS43OGMuNjEtLjU1IDEtMS4zNCAxLTIuMjJWNmMwLTMuNS0zLjU4LTQtOC00cy04IC41LTggNHYxMHptMy41IDFjLS44MyAwLTEuNS0uNjctMS41LTEuNVM2LjY3IDE0IDcuNSAxNHMxLjUuNjcgMS41IDEuNVM4LjMzIDE3IDcuNSAxN3ptOSAwYy0uODMgMC0xLjUtLjY3LTEuNS0xLjVzLjY3LTEuNSAxLjUtMS41IDEuNS42NyAxLjUgMS41LS42NyAxLjUtMS41IDEuNXptMS41LTZINlY2aDEydjV6Ii8+PC9zdmc+',
  CAR: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48c3R5bGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB0eXBlPSJ0ZXh0L2NzcyI+LnN0MXtmaWxsOiMwMDAwMDA7fTwvc3R5bGU+PHBhdGggY2xhc3M9InN0MSIgZD0iTTE4LjkyIDYuMDFDMTguNzIgNS40MiAxOC4xNiA1IDE3LjUgNWgtMTFjLS42NiAwLTEuMjEuNDItMS40MiAxLjAxTDMgMTJ2OGMwIC41NS40NSAxIDEgMWgxYy41NSAwIDEtLjQ1IDEtMXYtMWgxMnYxYzAgLjU1LjQ1IDEgMSAxaDFjLjU1IDAgMS0uNDUgMS0xdi04bC0yLjA4LTUuOTl6TTYuNSAxNmMtLjgzIDAtMS41LS42Ny0xLjUtMS41UzUuNjcgMTMgNi41IDEzczEuNS42NyAxLjUgMS41UzcuMzMgMTYgNi41IDE2em0xMSAwYy0uODMgMC0xLjUtLjY3LTEuNS0xLjVzLjY3LTEuNSAxLjUtMS41IDEuNS42NyAxLjUgMS41LS42NyAxLjUtMS41IDEuNXpNNSAxMWwxLjUtNC41aDExTDE5IDExSDV6Ii8+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
  HELICOPTER: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNzAuMDggMTcwLjA4Ij48ZGVmcz48c3R5bGU+LmNscy0xLC5jbHMtMiwuY2xzLTN7ZmlsbDpub25lO3N0cm9rZTojMDAwMDAwO3N0cm9rZS1taXRlcmxpbWl0OjEwO30uY2xzLTF7c3Ryb2tlLXdpZHRoOjZweDt9LmNscy0yLC5jbHMtM3tzdHJva2UtbGluZWNhcDpyb3VuZDt9LmNscy0ye3N0cm9rZS13aWR0aDozcHg7fS5jbHMtM3tzdHJva2Utd2lkdGg6NXB4O30uc3Qxe2ZpbGw6IzAwMDAwMH08L3N0eWxlPjwvZGVmcz48dGl0bGU+aGVsaWNvcHRlcjwvdGl0bGU+PGcgaWQ9ImhlbGljb3B0ZXIiPjxnIGlkPSJDYWxxdWVfMTIiIGRhdGEtbmFtZT0iQ2FscXVlIDEyIj48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTA0LjIxLDcxYzguMDksMCwxNi4xNywwLDIwLjM5LDAsNS4wNiwwLDEyLjgsNCwxNiwxMC4xMWwxMi44MSwyNC43M2gtNDIuMkEyLjIzLDIuMjMsMCwwLDEsMTA5LDEwNFoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjQuODksNTUuOTRIMzYuMjZhMS4xMiwxLjEyLDAsMCwxLDEuMDUuNzRMNDIuNDQsNzFIOTkuMTJMMTA0LDEwNC4xOWE2Ljk0LDYuOTQsMCwwLDAsNi44Nyw1LjkzSDE1NHY0LjczYzAsMy4xNy0yLjM3LDQuODctNS4yNiw0Ljg3SDEwNy41NGMtMywwLTEzLC43OS0yMS43LTE3Ljg4Qzc4LjEsODUuNzUsNzMsODUuNzIsNjEuODEsODUuNzVIMjQuODlhMS4xMywxLjEzLDAsMCwxLTEuMTItMS4xM1Y1Ny4wNkExLjEyLDEuMTIsMCwwLDEsMjQuODksNTUuOTRaIi8+PGNpcmNsZSBjbGFzcz0iY2xzLTEiIGN4PSIyNC44MyIgY3k9Ijg1LjAzIiByPSI3LjMxIi8+PHBvbHlsaW5lIGNsYXNzPSJjbHMtMiAiIHBvaW50cz0iOTYuNDcgMTMyLjcgMTQxLjcxIDEzMi43IDE0Ny40IDEyNyIvPjxsaW5lIGNsYXNzPSJjbHMtMiAiIHgxPSIxMTEuODgiIHkxPSIxMTguMjkiIHgyPSIxMDIuMDQiIHkyPSIxMzIuNyIvPjxsaW5lIGNsYXNzPSJjbHMtMiAiIHgxPSIxMzYuNyIgeTE9IjExOS43MiIgeDI9IjEzNi43IiB5Mj0iMTMyLjciLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNNzMuMzMsNjQuMzFsMi43Ny03LjM5YS42Ny42NywwLDAsMSwuNjItLjQzSDg3LjgxYS42Ny42NywwLDAsMSwuNjEuNDFsMy4xLDcuMzhhLjY2LjY2LDAsMCwxLS42MS45M0g3NEEuNjcuNjcsMCwwLDEsNzMuMzMsNjQuMzFaIi8+PGxpbmUgY2xhc3M9ImNscy0zIiB4MT0iODIuNDUiIHkxPSI1Ni40OSIgeDI9IjgyLjQ1IiB5Mj0iMzcuMzgiLz48bGluZSBjbGFzcz0iY2xzLTMiIHgxPSIxNi4xMiIgeTE9IjQzLjUiIHgyPSIxNTMuNDEiIHkyPSI0My41Ii8+PC9nPjwvZz48L3N2Zz4=',
  HELMET: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNzAuMDggMTcwLjA4Ij48dGl0bGU+c2FmZXR5IGhlbG1ldDwvdGl0bGU+PHN0eWxlIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdHlwZT0idGV4dC9jc3MiPi5zdDF7ZmlsbDojMDAwMDAwO308L3N0eWxlPjxnIGlkPSJzYWZldHlfaGVsbWV0IiBkYXRhLW5hbWU9InNhZmV0eSBoZWxtZXQiPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik02Myw0OC4zMWMtMS4xMy04LTEuNTEtOCw2LThoMzEuODdjNy41NCwwLDcuNTIuNjcsNi42Niw4LjE5bC00LjE1LDM4Ljg3YTMuMiwzLjIsMCwwLDEtMy4xOSwyLjg3SDcwLjg1YTMuMiwzLjIsMCwwLDEtMy4xOS0yLjgyWiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zMS43NywxMDEuNTdjMC0xMi4zMywxLjE1LTMzLjgzLDIzLjY1LTQ4Ljg0YTMuODgsMy44OCwwLDAsMSw2LDIuNzZMNjUuODMsODguOWEzLjg5LDMuODksMCwwLDAsMy44OSwzLjM4TDEwMS42MSw5MmEzLjg5LDMuODksMCwwLDAsMy44NC0zLjQ0bDMuODEtMzNhMy44OCwzLjg4LDAsMCwxLDYuMDYtMi43N2M4LjMyLDUuNzksMjMuMjgsMjAuMTEsMjIuNjMsNDhhMy44NiwzLjg2LDAsMCwwLDIuNTUsMy43bDMsMS4wOGEzLjg5LDMuODksMCwwLDEsMi41NSwzLjY2djcuMjJhMy44OSwzLjg5LDAsMCwxLTIuNTYsMy42NmMtMTEuMzksNC4xOC01OS40MywxOS4yNi0xMTYuNzYuNTRhMy45LDMuOSwwLDAsMS0yLjY2LTMuNzF2LTcuMzhhMy44OSwzLjg5LDAsMCwxLDMtMy43OGwxLjc5LS40NEEzLjg4LDMuODgsMCwwLDAsMzEuNzcsMTAxLjU3WiIvPjwvZz48L3N2Zz4=',
  PLANE: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48c3R5bGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB0eXBlPSJ0ZXh0L2NzcyI+LnN0MXtmaWxsOiMwMDAwMDA7fTwvc3R5bGU+PHBhdGggZD0iTTEwLjE4IDkiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjEgMTZ2LTJsLTgtNVYzLjVjMC0uODMtLjY3LTEuNS0xLjUtMS41UzEwIDIuNjcgMTAgMy41VjlsLTggNXYybDgtMi41VjE5bC0yIDEuNVYyMmwzLjUtMSAzLjUgMXYtMS41TDEzIDE5di01LjVsOCAyLjV6Ii8+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
  RAILWAY: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48c3R5bGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB0eXBlPSJ0ZXh0L2NzcyI+LnN0MXtmaWxsOiMwMDAwMDA7fTwvc3R5bGU+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00IDE1LjVDNCAxNy40MyA1LjU3IDE5IDcuNSAxOUw2IDIwLjV2LjVoMTJ2LS41TDE2LjUgMTljMS45MyAwIDMuNS0xLjU3IDMuNS0zLjVWNWMwLTMuNS0zLjU4LTQtOC00cy04IC41LTggNHYxMC41em04IDEuNWMtMS4xIDAtMi0uOS0yLTJzLjktMiAyLTIgMiAuOSAyIDItLjkgMi0yIDJ6bTYtN0g2VjVoMTJ2NXoiLz48L3N2Zz4=',
  RAIN: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNzAuMDggMTcwLjA4Ij48ZGVmcz48c3R5bGU+LnN0MXtmaWxsOiMwMDAwMDB9LmNscy0xe2ZpbGw6bm9uZTtzdHJva2U6IzAwMDAwMDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6NHB4O308L3N0eWxlPjwvZGVmcz48dGl0bGU+cmFpbjwvdGl0bGU+PGcgaWQ9InJhaW4iPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zNS41NiwxMDRjLTE5LjQyLTkuNTYtMjIuNzEtNTIuNDksMTQuMS01Ny43MUM1OS4zOSwyMywxMDkuNzQsNy43NSwxMjMuNDMsNTYuODZjMzguNDMsMy4zMywyOC4yNiw0OS45MSwxLjY5LDUyLjIzLDAsMC02MC4yMi41LTcyLC4yNVMzNS41NiwxMDQsMzUuNTYsMTA0WiIvPjxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjM5Ljc3IiB5MT0iMTE4LjM5IiB4Mj0iMzkuNzciIHkyPSIxMzMuNyIvPjxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjYyLjQiIHkxPSIxMzAuMzgiIHgyPSI2Mi40IiB5Mj0iMTQ1LjY5Ii8+PGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iMTA3LjE0IiB5MT0iMTMwLjM4IiB4Mj0iMTA3LjE0IiB5Mj0iMTQ1LjY5Ii8+PGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iODUuMDQiIHkxPSIxMTguMzkiIHgyPSI4NS4wNCIgeTI9IjEzMy43Ii8+PGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iMTI5LjIzIiB5MT0iMTE4LjE5IiB4Mj0iMTI5LjIzIiB5Mj0iMTMzLjUiLz48L2c+PC9zdmc+',
  RUN: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48c3R5bGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB0eXBlPSJ0ZXh0L2NzcyI+LnN0MXtmaWxsOiMwMDAwMDA7fTwvc3R5bGU+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMy40OSA1LjQ4YzEuMSAwIDItLjkgMi0ycy0uOS0yLTItMi0yIC45LTIgMiAuOSAyIDIgMnptLTMuNiAxMy45bDEtNC40IDIuMSAydjZoMnYtNy41bC0yLjEtMiAuNi0zYzEuMyAxLjUgMy4zIDIuNSA1LjUgMi41di0yYy0xLjkgMC0zLjUtMS00LjMtMi40bC0xLTEuNmMtLjQtLjYtMS0xLTEuNy0xLS4zIDAtLjUuMS0uOC4xbC01LjIgMi4ydjQuN2gydi0zLjRsMS44LS43LTEuNiA4LjEtNC45LTEtLjQgMiA3IDEuNHoiLz48L3N2Zz4=',
  SNOW: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNzAuMDggMTcwLjA4Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6bm9uZTtzdHJva2U6IzAwMDAwMDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6MnB4O30uc3Qxe2ZpbGw6IzAwMDAwMH08L3N0eWxlPjwvZGVmcz48dGl0bGU+c25vdzwvdGl0bGU+PGcgaWQ9InNub3ciPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zNS41MywxMDNDMTYuMSw5My40MywxMi44MSw1MC40Nyw0OS42NCw0NS4yNGM5LjczLTIzLjM1LDYwLjExLTM4LjU5LDczLjgxLDEwLjU1LDM4LjQ1LDMuMzMsMjguMjcsNDkuOTQsMS42OSw1Mi4yNiwwLDAtNjAuMjUuNS03Mi4wNy4yNVMzNS41MywxMDMsMzUuNTMsMTAzWiIvPjxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9Ijg3LjI3IiB5MT0iMTMxLjQ2IiB4Mj0iODcuMjciIHkyPSIxNDYuNzgiLz48bGluZSBjbGFzcz0iY2xzLTEiIHgxPSI5NC45MyIgeTE9IjEzOC45MiIgeDI9Ijc5LjYxIiB5Mj0iMTM4LjkyIi8+PGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iODEuMjEiIHkxPSIxMzMuMTciIHgyPSI5Mi45NCIgeTI9IjE0NC45Ii8+PGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iOTIuOTQiIHkxPSIxMzMuMTciIHgyPSI4MS4yMSIgeTI9IjE0NC45Ii8+PGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iNTMuNjUiIHkxPSIxMTcuMzYiIHgyPSI1My42NSIgeTI9IjEzMi42OCIvPjxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjYxLjMxIiB5MT0iMTI0LjgyIiB4Mj0iNDUuOTkiIHkyPSIxMjQuODIiLz48bGluZSBjbGFzcz0iY2xzLTEiIHgxPSI0Ny41OSIgeTE9IjExOS4wOCIgeDI9IjU5LjMxIiB5Mj0iMTMwLjgxIi8+PGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iNTkuMzEiIHkxPSIxMTkuMDgiIHgyPSI0Ny41OSIgeTI9IjEzMC44MSIvPjxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjExOC4zOCIgeTE9IjExNy4zNiIgeDI9IjExOC4zOCIgeTI9IjEzMi42OCIvPjxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjEyNi4wNCIgeTE9IjEyNC44MiIgeDI9IjExMC43MiIgeTI9IjEyNC44MiIvPjxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjExMi4zMSIgeTE9IjExOS4wOCIgeDI9IjEyNC4wNCIgeTI9IjEzMC44MSIvPjxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjEyNC4wNCIgeTE9IjExOS4wOCIgeDI9IjExMi4zMSIgeTI9IjEzMC44MSIvPjwvZz48L3N2Zz4=',
  STROLLER: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNzAuMDggMTcwLjA4Ij48ZGVmcz48c3R5bGU+LmNscy0xLC5jbHMtMntmaWxsOm5vbmU7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fS5jbHMtMXtzdHJva2Utd2lkdGg6OXB4O30uY2xzLTJ7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLXdpZHRoOjZweDt9LnN0MXtmaWxsOiMwMDAwMDB9PC9zdHlsZT48L2RlZnM+PHRpdGxlPnRyb2xsZXkgMjwvdGl0bGU+PGcgaWQ9InRyb2xsZXkiPjxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iNzkuNTQiIGN5PSIxMjkuNzIiIHI9IjE3LjA0Ii8+PGxpbmUgY2xhc3M9ImNscy0yIiB4MT0iMTU3LjkiIHkxPSIxMDIuMjEiIHgyPSI5OC44IiB5Mj0iMTI2LjA1Ii8+PHBvbHlsaW5lIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSI3NC42MyAxMTEuMDkgNDEuNTMgMjMuMzIgMTIuMTggMzMuMDIiLz48cmVjdCBjbGFzcz0ic3QxIiB4PSI4My43OSIgeT0iMzcuNjkiIHdpZHRoPSIyNi40MyIgaGVpZ2h0PSIyNi40MyIgdHJhbnNmb3JtPSJtYXRyaXgoMC45NCwgLTAuMzQsIDAuMzQsIDAuOTQsIC0xMS41MSwgMzUuODYpIi8+PHJlY3QgY2xhc3M9InN0MSIgeD0iOTguMTQiIHk9IjY4LjE3IiB3aWR0aD0iMzQuMjUiIGhlaWdodD0iMzQuMjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMi4wOCA0NC4wOCkgcm90YXRlKC0xOS44KSIvPjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9Ijc5LjU0IiBjeT0iMTI5LjcyIiByPSIyLjMxIi8+PC9nPjwvc3ZnPg==',
  SUBWAY: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48c3R5bGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB0eXBlPSJ0ZXh0L2NzcyI+LnN0MXtmaWxsOiMwMDAwMDA7fTwvc3R5bGU+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMiAyYy00LjQyIDAtOCAuNS04IDR2OS41QzQgMTcuNDMgNS41NyAxOSA3LjUgMTlMNiAyMC41di41aDEydi0uNUwxNi41IDE5YzEuOTMgMCAzLjUtMS41NyAzLjUtMy41VjZjMC0zLjUtMy41OC00LTgtNHpNNy41IDE3Yy0uODMgMC0xLjUtLjY3LTEuNS0xLjVTNi42NyAxNCA3LjUgMTRzMS41LjY3IDEuNSAxLjVTOC4zMyAxNyA3LjUgMTd6bTMuNS02SDZWNmg1djV6bTUuNSA2Yy0uODMgMC0xLjUtLjY3LTEuNS0xLjVzLjY3LTEuNSAxLjUtMS41IDEuNS42NyAxLjUgMS41LS42NyAxLjUtMS41IDEuNXptMS41LTZoLTVWNmg1djV6Ii8+PC9zdmc+',
  SUN: 'data:image/svg+xml;base64,PHN2ZyBpZD0iU3VuIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNzAuMDggMTcwLjA4Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjtzdHJva2U6IzAwMDAwMDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6NXB4O30uc3Qxe2ZpbGw6IzAwMDAwMH08L3N0eWxlPjwvZGVmcz48dGl0bGU+c3VuPC90aXRsZT48Y2lyY2xlIGNsYXNzPSJzdDEiIGN4PSI4NS4wNCIgY3k9Ijg1LjA0IiByPSI0Mi4xNiIvPjxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9Ijg1LjA0IiB5MT0iMzUuODUiIHgyPSI4NS4wNCIgeTI9IjEyLjI0Ii8+PGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iODUuMDQiIHkxPSIxNTcuODQiIHgyPSI4NS4wNCIgeTI9IjEzNC4yMyIvPjxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjExOS4zNSIgeTE9IjUwLjI1IiB4Mj0iMTM2LjA1IiB5Mj0iMzMuNTYiLz48bGluZSBjbGFzcz0iY2xzLTEiIHgxPSIzMy4wOSIgeTE9IjEzNi41MiIgeDI9IjQ5Ljc4IiB5Mj0iMTE5LjgyIi8+PGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iMTM0LjIzIiB5MT0iODQuNTYiIHgyPSIxNTcuODQiIHkyPSI4NC41NiIvPjxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjEyLjI0IiB5MT0iODQuNTYiIHgyPSIzNS44NSIgeTI9Ijg0LjU2Ii8+PGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iMTIyLjE5IiB5MT0iMTE2LjUzIiB4Mj0iMTQwLjAyIiB5Mj0iMTMyIi8+PGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iMzAuMDYiIHkxPSIzNi41NyIgeDI9IjQ3Ljg5IiB5Mj0iNTIuMDQiLz48L3N2Zz4=',
  TRANSIT: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48c3R5bGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB0eXBlPSJ0ZXh0L2NzcyI+LnN0MXtmaWxsOiMwMDAwMDA7fTwvc3R5bGU+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMiAyYy00LjQyIDAtOCAuNS04IDR2OS41QzQgMTcuNDMgNS41NyAxOSA3LjUgMTlMNiAyMC41di41aDEydi0uNUwxNi41IDE5YzEuOTMgMCAzLjUtMS41NyAzLjUtMy41VjZjMC0zLjUtMy41OC00LTgtNHpNNy41IDE3Yy0uODMgMC0xLjUtLjY3LTEuNS0xLjVTNi42NyAxNCA3LjUgMTRzMS41LjY3IDEuNSAxLjVTOC4zMyAxNyA3LjUgMTd6bTMuNS02SDZWNmg1djV6bTUuNSA2Yy0uODMgMC0xLjUtLjY3LTEuNS0xLjVzLjY3LTEuNSAxLjUtMS41IDEuNS42NyAxLjUgMS41LS42NyAxLjUtMS41IDEuNXptMS41LTZoLTVWNmg1djV6Ii8+PC9zdmc+',
  TROLLEY: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNzAuMDggMTcwLjA4Ij48c3R5bGU+LnN0MXtmaWxsOiMwMDAwMDB9PC9zdHlsZT48dGl0bGU+dHJvbGxleTwvdGl0bGU+PGcgaWQ9InRyb2xsZXkiPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yOS40NCwzMC4wNkg0NC4zNWExLjcyLDEuNzIsMCwwLDEsMS40Mi43Nmw2LDlhMS43LDEuNywwLDAsMCwxLjQyLjc2aDg1LjlhMy4yNiwzLjI2LDAsMCwxLDIuOCw0LjkyTDExNy4xNyw4Ny4yOWE2LjI3LDYuMjcsMCwwLDEtNS40LDMuMDhINzFhNS4zMiw1LjMyLDAsMCwwLTQuNzksM2wtMiw0LjEzQTMuODUsMy44NSwwLDAsMCw2Ny42NiwxMDNoNTlhMS43LDEuNywwLDAsMSwxLjcsMS43djguMTZhMS43LDEuNywwLDAsMS0xLjcsMS43SDU4LjgxYTMuNjksMy42OSwwLDAsMS0zLTEuNDhsLTQuNDktNmE1LjczLDUuNzMsMCwwLDEtLjUyLTZsNy45NC0xNS44NGExLjY3LDEuNjcsMCwwLDAsMC0xLjUxTDM5LjM4LDQzLjg1YTEuNywxLjcsMCwwLDAtMS41My0xSDI5LjQ0YTEuNywxLjcsMCwwLDEtMS43LTEuN1YzMS43NkExLjcsMS43LDAsMCwxLDI5LjQ0LDMwLjA2WiIvPjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjYxLjAxIiBjeT0iMTMxLjQ0IiByPSI4LjU3Ii8+PGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iMTE3LjM2IiBjeT0iMTMxLjQ0IiByPSI4LjU3Ii8+PC9nPjwvc3ZnPg==',
  TRUCK: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNzAuMDggMTcwLjA4Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LnN0MXtmaWxsOiMwMDAwMDB9PC9zdHlsZT48L2RlZnM+PHRpdGxlPnRydWNrPC90aXRsZT48ZyBpZD0iVHJ1Y2siPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMzIuNjUsMTIzLjExaDBhMywzLDAsMCwwLDMtM1YyNS42NWEzLDMsMCwwLDAtMy0zSDM3LjQzYTMsMywwLDAsMC0zLDNWMTIwLjFhMywzLDAsMCwwLDMsM2gzLjc2YTMsMywwLDAsMCwzLTNWNjYuNTNjMC03Ljc0LDUuMy0xMy4zMSwxNS0xMy4zMWg1Mi45YzEwLjYsMCwxNC42NCw1LjksMTQuNiwxMy4yMiwwLDkuODgtLjA3LDQzLjQzLS4wNyw1My42N2EzLDMsMCwwLDAsMywzWiIvPjxyZWN0IGNsYXNzPSJzdDEiIHg9IjQ2LjE2IiB5PSI1NS4zNCIgd2lkdGg9Ijc4LjciIGhlaWdodD0iODAuNDkiIHJ4PSI5LjM5IiByeT0iOS4zOSIvPjxyZWN0IGNsYXNzPSJzdDEiIHg9IjQ3LjkxIiB5PSIxMjQuNTgiIHdpZHRoPSIxNS4zNCIgaGVpZ2h0PSIyMi44NiIgcng9IjQuNDciIHJ5PSI0LjQ3Ii8+PHJlY3QgY2xhc3M9InN0MSIgeD0iMTA4LjA0IiB5PSIxMjQuNTgiIHdpZHRoPSIxNS4zNCIgaGVpZ2h0PSIyMi44NiIgcng9IjQuNDciIHJ5PSI0LjQ3Ii8+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSI1Mi4zNyIgeT0iNjkuOSIgd2lkdGg9IjY2LjI2IiBoZWlnaHQ9IjI1Ljg2Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTEiIGN4PSI1OC42NSIgY3k9IjExMy43NCIgcj0iNy42NyIvPjxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iMTEyLjE1IiBjeT0iMTEzLjc0IiByPSI3LjY3Ii8+PC9nPjwvc3ZnPg==',
  WALK: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48c3R5bGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB0eXBlPSJ0ZXh0L2NzcyI+LnN0MXtmaWxsOiMwMDAwMDA7fTwvc3R5bGU+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMy41IDUuNWMxLjEgMCAyLS45IDItMnMtLjktMi0yLTItMiAuOS0yIDIgLjkgMiAyIDJ6TTkuOCA4LjlMNyAyM2gyLjFsMS44LTggMi4xIDJ2Nmgydi03LjVsLTIuMS0yIC42LTNDMTQuOCAxMiAxNi44IDEzIDE5IDEzdi0yYy0xLjkgMC0zLjUtMS00LjMtMi40bC0xLTEuNmMtLjQtLjYtMS0xLTEuNy0xLS4zIDAtLjUuMS0uOC4xTDYgOC4zVjEzaDJWOS42bDEuOC0uNyIvPjwvc3ZnPg==',
}

const floor = {
  from: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNTEycHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTJwdCI+PGcgaWQ9InN1cmZhY2UxIj48cGF0aCBkPSJNIDQ5NyAwIEMgNDg4LjcxODc1IDAgNDgyIDYuNzE0ODQ0IDQ4MiAxNSBMIDQ4MiA0MC4xNjQwNjIgTCAzMCA0MC4xNjQwNjIgTCAzMCAxNSBDIDMwIDYuNzE0ODQ0IDIzLjI4NTE1NiAwIDE1IDAgQyA2LjcxNDg0NCAwIDAgNi43MTQ4NDQgMCAxNSBMIDAgNDk3IEMgMCA1MDUuMjg1MTU2IDYuNzE0ODQ0IDUxMiAxNSA1MTIgQyAyMy4yODUxNTYgNTEyIDMwIDUwNS4yODUxNTYgMzAgNDk3IEwgMzAgMzExLjE2NDA2MiBMIDQ4MiAzMTEuMTY0MDYyIEwgNDgyIDQ5NyBDIDQ4MiA1MDUuMjg1MTU2IDQ4OC43MTg3NSA1MTIgNDk3IDUxMiBDIDUwNS4yODUxNTYgNTEyIDUxMiA1MDUuMjg1MTU2IDUxMiA0OTcgTCA1MTIgMTUgQyA1MTIgNi43MTQ4NDQgNTA1LjI4NTE1NiAwIDQ5NyAwIFogTSA0ODIgMTYwLjY2NDA2MiBMIDM5MS41IDE2MC42NjQwNjIgTCAzOTEuNSA3MC4xNjQwNjIgTCA0ODIgNzAuMTY0MDYyIFogTSAyNDEgMTYwLjY2NDA2MiBMIDE1MC41IDE2MC42NjQwNjIgTCAxNTAuNSA3MC4xNjQwNjIgTCAyNDEgNzAuMTY0MDYyIFogTSAzMCAxOTAuNjY0MDYyIEwgMTIwLjUgMTkwLjY2NDA2MiBMIDEyMC41IDI4MS4xNjQwNjIgTCAzMCAyODEuMTY0MDYyIFogTSAyNzEgMTkwLjY2NDA2MiBMIDM2MS41IDE5MC42NjQwNjIgTCAzNjEuNSAyODEuMTY0MDYyIEwgMjcxIDI4MS4xNjQwNjIgWiBNIDI3MSAxOTAuNjY0MDYyICIgc3R5bGU9IiBzdHJva2U6bm9uZTtmaWxsLXJ1bGU6bm9uemVybztmaWxsOnJnYigwJSwwJSwwJSk7ZmlsbC1vcGFjaXR5OjE7IiAvPjwvZz48L3N2Zz4=',
  to: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNDkxLjMyNSA0OTEuMzI1IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0OTEuMzI1IDQ5MS4zMjU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBpZD0iWE1MSURfMzA1XyIgZD0iTTQyOS42NjYsMjIuNzNjLTEwOC03Ny44NDktMjE1Ljk4Miw3My41NTMtMzIzLjk4MSwyMC44OThWMzIuNDI3YzAtMTMuOTExLTExLjI4Ni0yNS4xOTctMjUuMTk2LTI1LjE5N2MtMTMuOTEsMC0yNS4xOTQsMTEuMjg2LTI1LjE5NCwyNS4xOTdWNDY2LjEzYzAsMTMuOTA5LDExLjI4NCwyNS4xOTUsMjUuMTk0LDI1LjE5NWMxMy45MSwwLDI1LjE5Ni0xMS4yODYsMjUuMTk2LTI1LjE5NVYyODIuMzk1YzEwMi42NTEsNTAuMDMsMjA1LjMwNC04NC4yNjQsMzA3Ljk3My0zMC44MjFjNC43MzksMi40NzcsMTAuNDMzLDIuMzEzLDE1LjAwNy0wLjQ3N2M0LjU3OC0yLjc3MSw3LjM2Ny03LjcyNSw3LjM2Ny0xMy4wOWMwLTY3LjYxMiwwLTEzNS4yMjgsMC0yMDIuODU5QzQzNi4wMzEsMzAuMjQ1LDQzMy42NSwyNS42LDQyOS42NjYsMjIuNzN6Ii8+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+'
}

export { uiConfig as default, icons, floor }
