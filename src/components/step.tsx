import { Badge } from "@/components/ui/badge";
type Props = {
  step: string;
};

export default function Step({ step }: Props) {
  if (step == "FINAL_APPROVE") {
    return (
      <Badge className='bg-gray-50 text-gray-900 text-lg rounded-sm my-4'>
        Final Approve
      </Badge>
    );
  }
  return (
    <Badge className='bg-gray-50 text-gray-900 text-lg rounded-sm my-4'>
      {step}
    </Badge>
  );
}

// ("Drafted", "Drafted"),
// ("PRE_APPROVE", "PRE_APPROVE"),
// ("FINAL_APPROVE", "FINAL_APPROVE"),
// ("DONE", "DONE"),
