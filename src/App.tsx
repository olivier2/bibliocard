import { HashRouter, Route, Routes } from 'react-router-dom';
import { FamilyContext, useFamilyState } from './hooks/useFamily';
import { BarcodeFormatContext, useBarcodeFormatState } from './hooks/useBarcodeFormat';
import { MembersScreen } from './screens/MembersScreen';
import { MemberScreen } from './screens/MemberScreen';
import { CardScreen } from './screens/CardScreen';

export default function App() {
  const family = useFamilyState();
  const barcodeFormat = useBarcodeFormatState();

  return (
    <FamilyContext.Provider value={family}>
      <BarcodeFormatContext.Provider value={barcodeFormat}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<MembersScreen />} />
            <Route path="/member/:memberId" element={<MemberScreen />} />
            <Route path="/member/:memberId/card/:cardId" element={<CardScreen />} />
          </Routes>
        </HashRouter>
      </BarcodeFormatContext.Provider>
    </FamilyContext.Provider>
  );
}
