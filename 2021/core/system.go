package core

import (
	"github.com/otiai10/copy"
)

// wrapper over github.com/otiai10/copy
func CopyFolder(source string, destination string) bool {
	err := copy.Copy(source, destination)
	return err == nil
}
