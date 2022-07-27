import { Typography } from "@mui/material"
import { Box } from "@mui/system"
import { FC, PropsWithChildren } from "react"
import { AdminNavbar } from "../admin"
import { Sidemenu } from "../ui"



interface Props {
    title: string,
    subTitle: string,
    icon?: JSX.Element
}



export const AdminLayout: FC <PropsWithChildren <Props>> = ({ children, title, subTitle, icon }) => {
  return (
    <>
        <nav>
            <AdminNavbar />
        </nav>

        <Sidemenu />

        <main style={{ 
            margin: '80px auto',
            maxWidth: '1440px',
            padding: '0px 30px'
        }}>
            <Box
                display= 'flex'
                flexDirection= 'column'
            >
                <Typography variant="h1" component="h1">
                    { icon }
                    {' '}{ title }
                </Typography>
                <Typography variant="h2" component="h2" sx={{ mb: 1 }}>{ subTitle }</Typography>
            </Box>

            <Box className="fadeIn">
                { children }
            </Box>

        </main>

    </>
  )
}
