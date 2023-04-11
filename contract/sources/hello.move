module hello_blockchain::hello {
     // Import necessary modules and define the schema of the message holder struct.
    use std::signer;
    use std::string;
    use aptos_framework::account;
    use aptos_framework::event;


    struct MessageHolder has key {
        message: string::String, // define message string variable
        message_change_events: event::EventHandle<MessageChangeEvent>,// define event instance
    }
   // Define the event to be emitted on message change.
    struct MessageChangeEvent has drop, store {
        from_message: string::String,// define from_message string variable
        to_message: string::String,// define to_message string variable
    }

    // Define the view function to retrieve the current message.
    #[view]
    // This view function is used to get the current message stored in MessageHolder.
    public fun get_message(addr: address): string::String acquires MessageHolder {
        if(exists<MessageHolder>(addr)) {
            *&borrow_global<MessageHolder>(addr).message // return the message stored in the Message Holder object
        }else {
           string:: utf8(b"Hello, Blockchain") // default string
        }
    }

    // Define the entry function to set a new message.
    // This is the entry point to update the message in MessageHolder.
    public entry fun set_message(account: signer, message: string::String)
    acquires MessageHolder {
        let account_addr = signer::address_of(&account);
        if (!exists<MessageHolder>(account_addr)) {
            move_to(&account, MessageHolder {
                message,
                message_change_events: account::new_event_handle<MessageChangeEvent>(&account),
            })
        } else {
            let old_message_holder = borrow_global_mut<MessageHolder>(account_addr);
            let from_message = *&old_message_holder.message;
            event::emit_event(&mut old_message_holder.message_change_events, MessageChangeEvent {
                from_message,
                to_message: copy message,
            });
            old_message_holder.message = message;
        }
    }

}