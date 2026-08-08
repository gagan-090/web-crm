import React from 'react';
import DwJobSearch from '../driver-welcome/DwJobSearch';

/**
 * Matchmaking's copy of the Open Jobs Board.
 *
 * The board is identical for both processes — same columns, same filters, same
 * eye-icon detail — and it is not caller-scoped, so this renders the shared
 * implementation against the match-making API prefix instead of duplicating
 * ~300 lines that would then have to be kept in step.
 */
export const MmJobSearch: React.FC = () => <DwJobSearch scope="mm" />;

export default MmJobSearch;
