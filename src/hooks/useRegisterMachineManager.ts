import { RegisterRepo } from "@/repos/RegisterRepo";
import { useMachine } from "@xstate/react";
import { fetchRegisterMachine } from "@/machines/registerUser";
import { RegisterUserProps } from "@/types/User/RegisterUserProps";
import { SimpleUserData } from "@/types/User/SimpleUserData";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";

function useRegisterMachineManager() {
    const RegisterRepoClass = new RegisterRepo();
    const [registerUserState, sendToRegisterMachine] = useMachine(fetchRegisterMachine, {
        actions: {
            registerUser: (ctx, event: { type: 'ATTEMPT_REGISTER'; payload: RegisterUserProps; }) => {
                RegisterRepoClass.create(event.payload)
                    .then(
                        (res: SimpleUserData) => {
                            console.log('User registered successfully.');
                            sendToRegisterMachine({ type: 'RESOLVE_REGISTER', user: res, err: null });
                        },
                        (err: FetchServerErrorResponse) => {
                            console.log('User register failed:', err.errors.message);
                            sendToRegisterMachine({ type: 'REJECT_REGISTER', err: err });
                        }
                    );
            }
        }
    });

    return { registerUserState, sendToRegisterMachine };
}

export  { useRegisterMachineManager };
