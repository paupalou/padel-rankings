import { useSignal } from "@preact/signals";

import Input from "components/input.tsx";
import Button from "components/button.tsx";

export default function SetSelection() {
  const needsThirdSet = useSignal(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center">
        <span className="mr-4">Set 1</span>
        <span className="text-xs text-slate-600 mr-2">team1</span>
        <Input name="set1team1" type="number" className="w-[50px]" max={7} />
        <span className="text-xs text-slate-600 mx-2">team2</span>
        <Input name="set1team2" type="number" className="w-[50px]" max={7} />
      </div>
      <div className="flex items-center">
        <span className="mr-4">Set 2</span>
        <span className="text-xs text-slate-600 mr-2">team1</span>
        <Input name="set2team1" type="number" className="w-[50px]" max={7} />
        <span className="text-xs text-slate-600 mx-2">team2</span>
        <Input name="set2team2" type="number" className="w-[50px]" max={7} />
      </div>

      {needsThirdSet.value
        ? (
          <div className="flex items-center">
            <span className="mr-4">Set 3</span>
            <span className="text-xs text-slate-600 mr-2">team1</span>
            <Input
              name="set3team1"
              type="number"
              className="w-[50px]"
              max={7}
            />
            <span className="text-xs text-slate-600 mx-2">team2</span>
            <Input
              name="set3team2"
              type="number"
              className="w-[50px]"
              max={7}
            />
          </div>
        )
        : (
          <Button onClick={() => needsThirdSet.value = true}>
            Add 3rd Set
          </Button>
        )}
    </div>
  );
}
