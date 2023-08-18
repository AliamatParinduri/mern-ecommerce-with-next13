import { Stack, Button, IconButton } from '@mui/material'
import { Twitter, Facebook, Google } from '@mui/icons-material'

const SocialAuth = () => {
  return (
    <>
      <Stack direction='row' spacing={2}>
        <IconButton
          onClick={() => alert('Very soon.')}
          sx={{
            border: '2px solid #ccc',
            borderRadius: '5px',
            padding: '0.5675rem',
            flex: 1,
          }}
        >
          <Google sx={{ color: '#DF3E30' }} width={22} height={22} />
        </IconButton>
        <IconButton
          onClick={() => alert('Very soon.')}
          sx={{
            border: '2px solid #ccc',
            borderRadius: '5px',
            padding: '0.5675rem',
            flex: 1,
          }}
        >
          <Facebook sx={{ color: '#1877F2' }} width={22} height={22} />
        </IconButton>
        <IconButton
          onClick={() => alert('Very soon.')}
          sx={{
            border: '2px solid #ccc',
            borderRadius: '5px',
            padding: '0.5675rem',
            flex: 1,
          }}
        >
          {/* <Icon
            icon='eva:twitter-fill'
            color='#1C9CEA'
            width={22}
            height={22}
          /> */}
          <Twitter sx={{ color: '#1C9CEA' }} width={22} height={22} />
        </IconButton>
      </Stack>
    </>
  )
}

export default SocialAuth
