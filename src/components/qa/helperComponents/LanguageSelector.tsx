"use client";

import {
  Button,
  Typography,
  Stack,
  Fade,
} from "@mui/material";
import { Language, ArrowDropDown } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { LanguagePair } from "@/types/language";
import theme from "@/theme";

const LanguageSelector = ({ selectedLanguagePair, onOpen }: { selectedLanguagePair: LanguagePair | null, onOpen: () => void }) => (
    <Button
      variant="outlined"
      onClick={onOpen}
      sx={{
        border: "2px solid",
        borderColor: "primary.main",
        "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.05) },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Language sx={{ color: "primary.main" }} />
        {selectedLanguagePair ? (
          <Fade in={!!selectedLanguagePair}>
            <Typography fontWeight={600}>
              {selectedLanguagePair.source} → {selectedLanguagePair.target}
            </Typography>
          </Fade>
        ) : (
          <Typography fontWeight={600}>Select Language</Typography>
        )}
        <ArrowDropDown sx={{ color: "primary.main" }} />
      </Stack>
    </Button>
    );
  
  export default LanguageSelector;